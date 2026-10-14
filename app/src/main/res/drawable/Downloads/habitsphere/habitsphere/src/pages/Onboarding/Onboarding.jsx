import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ArrowLeft, Check } from 'lucide-react'
import Sphere from '../../components/ui/Sphere.jsx'
import Nova from '../../components/nova/Nova.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { GOALS, STARTER_HABITS } from '../../data/defaults.js'
import { useApp } from '../../context/AppContext.jsx'

export default function Onboarding() {
  const navigate = useNavigate()
  const { completeOnboarding, loadDemo } = useApp()
  const [step, setStep] = useState(0)
  const [name, setName] = useState('')
  const [goal, setGoal] = useState('wellness')
  const [picked, setPicked] = useState(() => new Set(['Drink Water', 'Read', 'Meditate']))

  const toggle = (h) => {
    setPicked((prev) => {
      const n = new Set(prev)
      n.has(h.name) ? n.delete(h.name) : n.add(h.name)
      return n
    })
  }

  const finish = () => {
    const habits = STARTER_HABITS.filter((h) => picked.has(h.name))
    completeOnboarding(name.trim() || 'Friend', goal, habits)
    navigate('/dashboard')
  }

  const demo = () => {
    loadDemo(name.trim() || undefined)
    navigate('/dashboard')
  }

  const steps = [
    // Step 0 — welcome / name
    <div key="0" className="text-center">
      <Nova mood="happy" size={92} />
      <h1 className="mt-4 font-display text-3xl font-bold text-gradient">Welcome to HabitSphere</h1>
      <p className="mx-auto mt-2 max-w-sm text-muted">
        Let's set up your growth space. No account needed — you're continuing as a guest.
      </p>
      <div className="mx-auto mt-6 max-w-xs text-left">
        <label htmlFor="name" className="text-sm text-muted">What should Nova call you?</label>
        <input
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Your name"
          autoFocus
          className="mt-1.5 w-full rounded-xl2 border border-line bg-white/5 px-4 py-3 text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
          onKeyDown={(e) => e.key === 'Enter' && setStep(1)}
        />
      </div>
    </div>,

    // Step 1 — goal
    <div key="1">
      <h2 className="text-center font-display text-2xl font-bold text-ink">Choose your primary goal</h2>
      <p className="mt-1 text-center text-muted">Nova tailors encouragement to this.</p>
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
        {GOALS.map((g) => {
          const active = goal === g.id
          return (
            <button
              key={g.id}
              onClick={() => setGoal(g.id)}
              className={`flex items-center gap-3 rounded-xl2 border p-4 text-left transition-all ${
                active ? 'border-accent bg-primary/20 shadow-glow' : 'border-line bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className={`flex h-11 w-11 items-center justify-center rounded-xl2 ${active ? 'bg-accent/30 text-accent' : 'bg-white/5 text-muted'}`}>
                <Icon name={g.icon} size={20} />
              </span>
              <span>
                <span className="block font-semibold text-ink">{g.label}</span>
                <span className="block text-xs text-muted">{g.blurb}</span>
              </span>
              {active && <Check size={18} className="ml-auto text-accent" />}
            </button>
          )
        })}
      </div>
    </div>,

    // Step 2 — starter habits
    <div key="2">
      <h2 className="text-center font-display text-2xl font-bold text-ink">Pick your starter habits</h2>
      <p className="mt-1 text-center text-muted">Choose a few — you can change these anytime.</p>
      <div className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3">
        {STARTER_HABITS.map((h) => {
          const active = picked.has(h.name)
          return (
            <button
              key={h.name}
              onClick={() => toggle(h)}
              className={`flex flex-col items-center gap-2 rounded-xl2 border p-4 transition-all ${
                active ? 'border-accent bg-primary/20 shadow-glow' : 'border-line bg-white/5 hover:bg-white/10'
              }`}
            >
              <span className={`flex h-10 w-10 items-center justify-center rounded-full ${active ? 'bg-accent/30 text-accent' : 'bg-white/5 text-muted'}`}>
                <Icon name={h.icon} size={18} />
              </span>
              <span className="text-sm font-medium text-ink">{h.name}</span>
            </button>
          )
        })}
      </div>
      <p className="mt-4 text-center text-sm text-muted">{picked.size} selected</p>
    </div>,
  ]

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden px-4 py-10">
      <div className="app-aurora" />
      <div className="relative z-10 w-full max-w-xl">
        <div className="mb-6 flex items-center justify-center gap-2">
          <Sphere size={28} orbit={false} />
          <span className="font-display font-bold">
            Habit<span className="text-accent">Sphere</span>
          </span>
        </div>

        {/* progress dots */}
        <div className="mb-6 flex items-center justify-center gap-2">
          {steps.map((_, i) => (
            <span
              key={i}
              className={`h-1.5 rounded-full transition-all ${i === step ? 'w-8 bg-accent' : 'w-2 bg-white/15'}`}
            />
          ))}
        </div>

        <div className="glass rounded-xl3 p-6 sm:p-8 shadow-glow-lg">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 24 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -24 }}
              transition={{ duration: 0.3 }}
            >
              {steps[step]}
            </motion.div>
          </AnimatePresence>

          <div className="mt-8 flex items-center justify-between gap-3">
            {step > 0 ? (
              <button
                onClick={() => setStep((s) => s - 1)}
                className="inline-flex items-center gap-1.5 rounded-xl2 px-3 py-2.5 text-sm text-muted hover:text-ink"
              >
                <ArrowLeft size={16} /> Back
              </button>
            ) : (
              <button onClick={demo} className="text-sm text-muted hover:text-ink underline-offset-4 hover:underline">
                Skip · load demo
              </button>
            )}

            {step < steps.length - 1 ? (
              <button
                onClick={() => setStep((s) => s + 1)}
                className="inline-flex items-center gap-2 rounded-xl2 bg-primary px-5 py-2.5 font-semibold text-white shadow-glow border border-accent/40 hover:bg-accent transition-colors"
              >
                Continue <ArrowRight size={16} />
              </button>
            ) : (
              <button
                onClick={finish}
                disabled={picked.size === 0}
                className="inline-flex items-center gap-2 rounded-xl2 bg-success px-5 py-2.5 font-semibold text-white shadow-glow border border-success/40 hover:brightness-110 transition disabled:opacity-50"
              >
                Enter HabitSphere <Check size={16} />
              </button>
            )}
          </div>
        </div>
        <p className="mt-4 text-center text-xs text-muted">Continue as Guest · your data stays on this device</p>
      </div>
    </div>
  )
}
