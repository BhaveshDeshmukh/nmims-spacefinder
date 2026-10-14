import { useEffect, useRef, useState, useCallback } from 'react'
import { motion } from 'framer-motion'
import { Play, Pause, RotateCcw, Coffee, Brain } from 'lucide-react'
import { PageHeader, Panel } from '../../components/ui/Section.jsx'
import ProgressRing from '../../components/ui/ProgressRing.jsx'
import Nova from '../../components/nova/Nova.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { todayKey } from '../../utils/date.js'

const MODES = {
  focus: { label: 'Focus', minutes: 25, color: '#A855F7' },
  break: { label: 'Break', minutes: 5, color: '#22C55E' },
}

export default function Focus() {
  const { state, addFocusSession } = useApp()
  const [mode, setMode] = useState('focus')
  const [secondsLeft, setSecondsLeft] = useState(MODES.focus.minutes * 60)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  const total = MODES[mode].minutes * 60
  const pct = ((total - secondsLeft) / total) * 100
  const focusToday = (state.focus || {})[todayKey()] || 0

  const switchMode = useCallback((m) => {
    setMode(m)
    setRunning(false)
    setSecondsLeft(MODES[m].minutes * 60)
  }, [])

  const handleComplete = useCallback(() => {
    setRunning(false)
    if (mode === 'focus') {
      addFocusSession()
      // auto-suggest a break
      setMode('break')
      setSecondsLeft(MODES.break.minutes * 60)
    } else {
      setMode('focus')
      setSecondsLeft(MODES.focus.minutes * 60)
    }
  }, [mode, addFocusSession])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(intervalRef.current)
          handleComplete()
          return 0
        }
        return s - 1
      })
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running, handleComplete])

  const mm = String(Math.floor(secondsLeft / 60)).padStart(2, '0')
  const ss = String(secondsLeft % 60).padStart(2, '0')

  return (
    <div>
      <PageHeader title="Focus" subtitle="Protect your deep work with a distraction-free Pomodoro timer." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2 flex flex-col items-center py-10">
          {/* Mode toggle */}
          <div className="mb-8 inline-flex rounded-xl2 border border-line bg-white/5 p-1">
            {Object.entries(MODES).map(([k, v]) => (
              <button
                key={k}
                onClick={() => switchMode(k)}
                className={`inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-semibold transition ${
                  mode === k ? 'bg-primary text-white shadow-glow' : 'text-muted hover:text-ink'
                }`}
              >
                {k === 'focus' ? <Brain size={15} /> : <Coffee size={15} />}
                {v.label}
              </button>
            ))}
          </div>

          <motion.div animate={running ? { scale: [1, 1.015, 1] } : {}} transition={{ duration: 3, repeat: Infinity }}>
            <ProgressRing value={pct} size={252} stroke={12} color={MODES[mode].color} gradient={mode === 'focus'}>
              <span className="font-display text-6xl font-bold text-ink tabular-nums leading-none">
                {mm}:{ss}
              </span>
              <span className="mt-2 text-sm text-muted">{MODES[mode].label} session</span>
            </ProgressRing>
          </motion.div>

          {/* Controls */}
          <div className="mt-10 flex items-center gap-3">
            <button
              onClick={() => { setRunning(false); setSecondsLeft(MODES[mode].minutes * 60) }}
              aria-label="Reset timer"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/5 text-muted hover:text-ink hover:bg-white/10"
            >
              <RotateCcw size={18} />
            </button>
            <button
              onClick={() => setRunning((r) => !r)}
              className="flex h-16 w-16 items-center justify-center rounded-full bg-primary text-white shadow-glow border border-accent/40 hover:bg-accent transition"
              aria-label={running ? 'Pause' : 'Start'}
            >
              {running ? <Pause size={24} /> : <Play size={24} className="ml-0.5" />}
            </button>
            <button
              onClick={handleComplete}
              aria-label="Skip session"
              className="flex h-12 w-12 items-center justify-center rounded-full border border-line bg-white/5 text-muted hover:text-ink hover:bg-white/10"
            >
              <Icon name="SkipForward" size={18} />
            </button>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel className="text-center">
            <p className="text-sm text-muted">Sessions today</p>
            <p className="font-display text-5xl font-bold text-gradient">{focusToday}</p>
            <p className="mt-1 text-xs text-muted">{state.focusTotal || 0} all-time · +25 XP each</p>
          </Panel>

          <Panel className="flex items-center gap-4">
            <Nova mood={running && mode === 'focus' ? 'encouraging' : 'idle'} size={62} />
            <p className="text-sm text-muted">
              {running
                ? mode === 'focus'
                  ? 'Deep work in progress. Nova is guarding your focus.'
                  : 'Rest your mind — you earned it.'
                : 'Press play to begin a focused block.'}
            </p>
          </Panel>

          <Panel>
            <p className="mb-2 font-display font-semibold text-ink">Tips</p>
            <ul className="space-y-2 text-sm text-muted">
              <li className="flex gap-2"><Icon name="Check" size={16} className="text-success" /> Silence notifications for 25 minutes.</li>
              <li className="flex gap-2"><Icon name="Check" size={16} className="text-success" /> One task per session.</li>
              <li className="flex gap-2"><Icon name="Check" size={16} className="text-success" /> Stand and stretch on breaks.</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  )
}
