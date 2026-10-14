import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowRight, Sparkles, Droplets, Timer, LineChart, Flower2, Trophy, BookOpen } from 'lucide-react'
import Sphere from '../../components/ui/Sphere.jsx'
import Nova from '../../components/nova/Nova.jsx'
import GardenScene from '../../components/garden/GardenScene.jsx'
import { useApp } from '../../context/AppContext.jsx'

const FEATURES = [
  { icon: Sparkles, title: 'Growth Score', desc: 'A real 0–100 score from your daily actions.' },
  { icon: Flower2, title: 'Habit Garden', desc: 'Your consistency grows a living garden.' },
  { icon: Timer, title: 'Focus Mode', desc: 'Built-in Pomodoro to protect deep work.' },
  { icon: LineChart, title: 'Habit DNA', desc: 'Insights derived from your own patterns.' },
  { icon: Droplets, title: 'Water & Mood', desc: 'Track hydration and how you feel.' },
  { icon: Trophy, title: 'Achievements', desc: 'Unlock milestones as you build streaks.' },
]

const fade = {
  hidden: { opacity: 0, y: 20 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { delay: i * 0.08, duration: 0.5, ease: [0.22, 1, 0.36, 1] } }),
}

export default function Landing() {
  const navigate = useNavigate()
  const { state, loadDemo } = useApp()

  const startJourney = () => {
    navigate(state.user?.onboarded ? '/dashboard' : '/onboarding')
  }
  const exploreDemo = () => {
    loadDemo()
    navigate('/dashboard')
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="app-aurora" />

      {/* Nav */}
      <header className="relative z-10 mx-auto flex max-w-6xl items-center justify-between px-5 py-5">
        <div className="flex items-center gap-2.5">
          <Sphere size={34} />
          <span className="font-display text-xl font-bold">
            Habit<span className="text-accent">Sphere</span>
          </span>
        </div>
        <button
          onClick={startJourney}
          className="rounded-xl2 border border-line bg-white/5 px-4 py-2 text-sm font-semibold text-ink hover:bg-white/10 transition-colors"
        >
          {state.user?.onboarded ? 'Open App' : 'Get Started'}
        </button>
      </header>

      {/* Hero */}
      <section className="relative z-10 mx-auto grid max-w-6xl items-center gap-10 px-5 pb-8 pt-8 md:pt-14 lg:grid-cols-2">
        <div>
          <motion.div variants={fade} initial="hidden" animate="show" className="mb-5 inline-flex items-center gap-2 rounded-full border border-accent/30 bg-accent/10 px-3 py-1 text-xs font-medium text-accent">
            <Sparkles size={13} /> Mental Wellness & Habit Tracker
          </motion.div>

          <motion.h1
            variants={fade}
            initial="hidden"
            animate="show"
            custom={1}
            className="font-display text-5xl md:text-6xl font-bold leading-[1.05]"
          >
            <span className="text-gradient">HabitSphere</span>
          </motion.h1>

          <motion.p
            variants={fade}
            initial="hidden"
            animate="show"
            custom={2}
            className="mt-3 font-display text-2xl md:text-3xl font-semibold text-ink/90 leading-tight"
          >
            One dashboard.<br />Better habits.<br />Better life.
          </motion.p>

          <motion.p
            variants={fade}
            initial="hidden"
            animate="show"
            custom={3}
            className="mt-5 max-w-md text-muted leading-relaxed"
          >
            A personal growth companion that helps you build consistent routines through
            tracking, insights, motivation and visual progress.
          </motion.p>

          <motion.div
            variants={fade}
            initial="hidden"
            animate="show"
            custom={4}
            className="mt-7 flex flex-wrap items-center gap-3"
          >
            <button
              onClick={startJourney}
              className="group inline-flex items-center gap-2 rounded-xl2 bg-primary px-5 py-3 font-semibold text-white shadow-glow border border-accent/40 hover:bg-accent transition-colors"
            >
              Start Your Journey
              <ArrowRight size={18} className="transition-transform group-hover:translate-x-1" />
            </button>
            <button
              onClick={exploreDemo}
              className="rounded-xl2 border border-line bg-white/5 px-5 py-3 font-semibold text-ink hover:bg-white/10 transition-colors"
            >
              Explore Demo
            </button>
          </motion.div>
        </div>

        {/* Product preview */}
        <motion.div
          initial={{ opacity: 0, scale: 0.94, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative"
        >
          <div className="glass rounded-xl3 p-5 shadow-glow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs text-muted">Growth Score</p>
                <p className="font-display text-4xl font-bold text-gradient">87</p>
              </div>
              <Nova mood="happy" size={64} />
            </div>
            <div className="mt-4 overflow-hidden rounded-xl2 border border-line bg-bg/40">
              <GardenScene health={82} plants={5} height={168} />
            </div>
            <div className="mt-4 grid grid-cols-3 gap-3">
              {[
                { l: 'Streak', v: '12d', i: 'Flame' },
                { l: 'Water', v: '2.4L', i: 'Droplets' },
                { l: 'Focus', v: '3', i: 'Timer' },
              ].map((s) => (
                <div key={s.l} className="rounded-xl2 border border-line bg-white/5 p-3 text-center">
                  <p className="text-lg font-bold text-ink">{s.v}</p>
                  <p className="text-[11px] text-muted">{s.l}</p>
                </div>
              ))}
            </div>
          </div>
          <motion.div
            className="absolute -right-3 -top-4 rounded-xl2 glass px-3 py-2 text-xs text-accent shadow-glow"
            animate={{ y: [0, -8, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
          >
            +20 XP
          </motion.div>
        </motion.div>
      </section>

      {/* Nova intro */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-10">
        <div className="glass flex flex-col items-center gap-5 rounded-xl3 p-6 text-center sm:flex-row sm:text-left">
          <Nova mood="excited" size={84} />
          <div>
            <h3 className="font-display text-xl font-semibold">Meet Nova, your growth companion</h3>
            <p className="mt-1 max-w-2xl text-muted">
              Nova reacts to what you actually do — celebrating streaks, softening rough days, and
              nudging you toward one small win. It's a local, rule-based companion: intelligent-feeling,
              no fake AI claims.
            </p>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-6">
        <h2 className="mb-6 text-center font-display text-2xl font-bold text-ink">
          Everything for your growth, in one sphere
        </h2>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((f, i) => (
            <motion.div
              key={f.title}
              variants={fade}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true, margin: '-40px' }}
              custom={i}
              className="surface rounded-xl3 p-5"
            >
              <span className="mb-3 inline-flex h-11 w-11 items-center justify-center rounded-xl2 bg-primary/20 text-accent border border-accent/25">
                <f.icon size={20} />
              </span>
              <h3 className="font-semibold text-ink">{f.title}</h3>
              <p className="mt-1 text-sm text-muted">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Final CTA */}
      <section className="relative z-10 mx-auto max-w-6xl px-5 py-14">
        <div className="glass relative overflow-hidden rounded-xl3 p-8 text-center shadow-glow-lg">
          <div className="pointer-events-none absolute -top-16 left-1/2 h-40 w-40 -translate-x-1/2 rounded-full bg-accent/30 blur-3xl" />
          <Sphere size={54} className="mb-3" />
          <h2 className="font-display text-2xl md:text-3xl font-bold text-gradient">
            Start building the better version of you
          </h2>
          <p className="mx-auto mt-2 max-w-md text-muted">
            No sign-up needed. Continue as guest and your journey saves locally.
          </p>
          <button
            onClick={startJourney}
            className="mt-6 inline-flex items-center gap-2 rounded-xl2 bg-primary px-6 py-3 font-semibold text-white shadow-glow border border-accent/40 hover:bg-accent transition-colors"
          >
            Start Your Journey <ArrowRight size={18} />
          </button>
        </div>
        <footer className="mt-8 flex flex-col items-center gap-1 text-center text-xs text-muted">
          <span>HabitSphere · Built for PixxelHack 2.0</span>
          <span className="inline-flex items-center gap-1">
            <BookOpen size={12} /> Frontend-only · Data stays on your device
          </span>
        </footer>
      </section>
    </div>
  )
}
