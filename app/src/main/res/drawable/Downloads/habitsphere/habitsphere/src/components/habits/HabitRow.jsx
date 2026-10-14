import { motion } from 'framer-motion'
import { Check, Flame, MoreVertical, Clock } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { todayKey } from '../../utils/date.js'
import { habitStreak } from '../../utils/gamification.js'

export default function HabitRow({ habit, onEdit, showMeta = true }) {
  const { toggleHabit } = useApp()
  const done = (habit.completedDates || []).includes(todayKey())
  const streak = habitStreak(habit)

  return (
    <motion.div
      layout
      className={`flex items-center gap-3 rounded-xl2 border p-3 transition-colors ${
        done ? 'border-success/30 bg-success/10' : 'border-line bg-white/5'
      }`}
    >
      <motion.button
        whileTap={{ scale: 0.85 }}
        onClick={() => toggleHabit(habit.id)}
        aria-label={done ? `Mark ${habit.name} incomplete` : `Complete ${habit.name}`}
        aria-pressed={done}
        className={`relative flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-xl2 border transition-all ${
          done
            ? 'border-success bg-success text-white'
            : 'border-accent/30 bg-primary/15 text-accent hover:bg-primary/25'
        }`}
      >
        {done ? <Check size={20} /> : <Icon name={habit.icon} size={20} />}
      </motion.button>

      <div className="min-w-0 flex-1">
        <p className={`truncate font-medium ${done ? 'text-muted line-through' : 'text-ink'}`}>
          {habit.name}
        </p>
        {showMeta && (
          <div className="mt-0.5 flex items-center gap-2 text-xs text-muted">
            <span className="rounded-full bg-white/5 px-2 py-0.5">{habit.category}</span>
            {habit.reminder && (
              <span className="inline-flex items-center gap-1">
                <Clock size={11} /> {habit.reminder}
              </span>
            )}
          </div>
        )}
      </div>

      {streak > 0 && (
        <span className="inline-flex items-center gap-1 rounded-full bg-warning/15 px-2 py-1 text-xs font-semibold text-warning">
          <Flame size={12} /> {streak}
        </span>
      )}

      {onEdit && (
        <button
          onClick={() => onEdit(habit)}
          aria-label={`Edit ${habit.name}`}
          className="rounded-lg p-2 text-muted hover:bg-white/10 hover:text-ink"
        >
          <MoreVertical size={16} />
        </button>
      )}
    </motion.div>
  )
}
