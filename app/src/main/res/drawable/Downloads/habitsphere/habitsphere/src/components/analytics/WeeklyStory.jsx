import { motion } from 'framer-motion'
import { Sparkles } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { lastNDays, longWeekday } from '../../utils/date.js'
import { completionForDay } from '../../utils/gamification.js'
import { MOODS } from '../../data/defaults.js'

// A mini "Spotify Wrapped" recap — every figure derived from stored activity.
export default function WeeklyStory() {
  const { state } = useApp()
  const habits = state.habits || []
  const days = lastNDays(7)

  // Habits completed this week
  let completed = 0
  const dayScores = days.map((k) => {
    const c = completionForDay(habits, k)
    completed += c.done
    return { key: k, done: c.done, rate: c.rate }
  })

  // Best day
  const bestDay = dayScores.reduce((a, b) => (b.done > a.done ? b : a), dayScores[0])

  // Best habit (most completions in the last 7 days)
  let bestHabit = null
  habits.forEach((h) => {
    const n = (h.completedDates || []).filter((d) => days.includes(d)).length
    if (!bestHabit || n > bestHabit.n) bestHabit = { name: h.name, n }
  })

  // Water consistency (days meeting >=70% of goal)
  const goal = state.waterGoal || 3000
  const waterDays = days.filter((k) => ((state.water || {})[k] || 0) >= goal * 0.7).length

  // Focus time
  const focusSessions = days.reduce((s, k) => s + ((state.focus || {})[k] || 0), 0)

  // Mood trend
  const moodScores = days.map((k) => MOODS.find((m) => m.id === (state.moods || {})[k])?.score).filter(Boolean)
  const avgMood = moodScores.length ? (moodScores.reduce((s, x) => s + x, 0) / moodScores.length) : 0
  const moodLabel = avgMood >= 4 ? 'Mostly great' : avgMood >= 3 ? 'Balanced' : avgMood > 0 ? 'A tough week' : 'Not logged'

  const cards = [
    { icon: 'CheckCircle2', label: 'Habits completed', value: completed, hue: '#22C55E' },
    { icon: 'Trophy', label: 'Best habit', value: bestHabit?.n ? bestHabit.name : '—', hue: '#F59E0B' },
    { icon: 'Star', label: 'Strongest day', value: bestDay?.done ? longWeekday(bestDay.key) : '—', hue: '#A855F7' },
    { icon: 'Droplets', label: 'Water consistency', value: `${waterDays}/7 days`, hue: '#3B82F6' },
    { icon: 'Timer', label: 'Focus sessions', value: focusSessions, hue: '#7C3AED' },
    { icon: 'HeartPulse', label: 'Mood trend', value: moodLabel, hue: '#EF4444' },
  ]

  return (
    <div className="relative overflow-hidden rounded-xl3 border border-accent/25 bg-gradient-to-br from-primary/20 via-surface/50 to-surface/60 p-5 md:p-6 shadow-glow">
      <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-accent/20 blur-3xl" />
      <div className="relative mb-4 flex items-center gap-2">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-accent/25 text-accent"><Sparkles size={18} /></span>
        <div>
          <h2 className="font-display text-lg font-semibold text-ink">Your Week in Review</h2>
          <p className="text-xs text-muted">A recap built from your last 7 days</p>
        </div>
      </div>

      <div className="relative grid grid-cols-2 gap-3 md:grid-cols-3">
        {cards.map((c, i) => (
          <motion.div
            key={c.label}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.06 }}
            className="rounded-xl2 border border-line bg-bg/40 p-3.5"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-lg" style={{ background: `${c.hue}22`, color: c.hue }}>
              <Icon name={c.icon} size={16} />
            </span>
            <p className="mt-2 truncate font-display text-lg font-bold text-ink" title={String(c.value)}>{c.value}</p>
            <p className="text-xs text-muted">{c.label}</p>
          </motion.div>
        ))}
      </div>

      {bestDay?.done > 0 && (
        <p className="relative mt-4 text-center text-sm text-muted">
          Your strongest day was <span className="font-semibold text-accent">{longWeekday(bestDay.key)}</span>
          {bestHabit?.n ? <> · <span className="font-semibold text-accent">{bestHabit.name}</span> was your most consistent habit.</> : '.'}
        </p>
      )}
    </div>
  )
}
