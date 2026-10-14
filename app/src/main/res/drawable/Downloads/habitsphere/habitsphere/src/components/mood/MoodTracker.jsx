import { motion } from 'framer-motion'
import { useApp } from '../../context/AppContext.jsx'
import { MOODS } from '../../data/defaults.js'
import { todayKey, lastNDays, shortWeekday } from '../../utils/date.js'

export default function MoodTracker() {
  const { state, setMood } = useApp()
  const today = (state.moods || {})[todayKey()]

  const recent = lastNDays(7).map((k) => ({
    key: k,
    mood: MOODS.find((m) => m.id === (state.moods || {})[k]),
  }))

  return (
    <div>
      <div className="flex items-center justify-between">
        <span className="font-display font-semibold text-ink">How are you feeling?</span>
        {today && <span className="text-xs text-accent">Logged today</span>}
      </div>

      <div className="mt-4 flex justify-between gap-1.5">
        {MOODS.map((m) => {
          const active = today === m.id
          return (
            <motion.button
              key={m.id}
              whileTap={{ scale: 0.9 }}
              onClick={() => setMood(m.id)}
              aria-label={`Mood: ${m.label}`}
              aria-pressed={active}
              className={`flex flex-1 flex-col items-center gap-1 rounded-xl2 border px-1 py-2.5 transition-all ${
                active ? 'border-accent bg-primary/20 shadow-glow' : 'border-line bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className="text-2xl leading-none" style={{ filter: active ? 'none' : 'grayscale(0.3)' }}>
                {m.emoji}
              </span>
              <span className={`text-[10px] ${active ? 'text-ink' : 'text-muted'}`}>{m.label}</span>
            </motion.button>
          )
        })}
      </div>

      {/* 7-day trend */}
      <div className="mt-5">
        <p className="mb-2 text-xs text-muted">Last 7 days</p>
        <div className="flex items-end justify-between gap-1.5" style={{ height: 56 }}>
          {recent.map((r) => (
            <div key={r.key} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex w-full flex-1 items-end">
                <div
                  className="w-full rounded-t-md transition-all"
                  style={{
                    height: r.mood ? `${(r.mood.score / 5) * 100}%` : '8%',
                    background: r.mood ? r.mood.color : 'rgba(255,255,255,0.08)',
                    opacity: r.mood ? 0.85 : 1,
                    minHeight: 4,
                  }}
                  title={r.mood ? r.mood.label : 'No entry'}
                />
              </div>
              <span className="text-[9px] text-muted">{shortWeekday(r.key).charAt(0)}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
