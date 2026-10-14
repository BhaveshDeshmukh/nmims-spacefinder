import { motion } from 'framer-motion'
import { LifeBuoy, X, Droplets, Footprints, Star } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { needsRecovery } from '../../utils/gamification.js'
import { todayKey } from '../../utils/date.js'

export default function RecoveryBanner() {
  const { state, dismissRecovery, addWater, toggleHabit } = useApp()
  if (!needsRecovery(state)) return null

  const firstHabit = (state.habits || [])[0]
  const doneToday = firstHabit && (firstHabit.completedDates || []).includes(todayKey())

  const actions = [
    { icon: Droplets, label: 'Drink a glass of water', onClick: () => addWater(250) },
    { icon: Footprints, label: 'Walk for 10 minutes', onClick: () => {} },
    firstHabit && {
      icon: Star,
      label: `Complete “${firstHabit.name}”`,
      onClick: () => !doneToday && toggleHabit(firstHabit.id),
    },
  ].filter(Boolean)

  return (
    <motion.section
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="relative overflow-hidden rounded-xl3 border border-accent/30 bg-gradient-to-br from-primary/25 to-surface/60 p-5 shadow-glow"
    >
      <button
        onClick={dismissRecovery}
        aria-label="Dismiss recovery mode"
        className="absolute right-3 top-3 rounded-lg p-1.5 text-muted hover:bg-white/10 hover:text-ink"
      >
        <X size={16} />
      </button>
      <div className="flex items-center gap-2 text-accent">
        <LifeBuoy size={20} />
        <h3 className="font-display text-lg font-semibold text-ink">Let's restart.</h3>
      </div>
      <p className="mt-1 max-w-lg text-sm text-muted">
        The last few days were light — that's completely okay. Forget catching up. Just pick one
        small win to get moving again.
      </p>
      <div className="mt-4 grid gap-2 sm:grid-cols-3">
        {actions.map((a, i) => (
          <button
            key={i}
            onClick={a.onClick}
            className="flex items-center gap-2.5 rounded-xl2 border border-line bg-white/5 p-3 text-left text-sm text-ink hover:bg-white/10"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-accent/20 text-accent">
              <a.icon size={16} />
            </span>
            {a.label}
          </button>
        ))}
      </div>
    </motion.section>
  )
}
