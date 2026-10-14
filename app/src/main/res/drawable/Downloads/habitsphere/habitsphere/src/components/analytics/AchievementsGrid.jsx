import { motion } from 'framer-motion'
import { Lock } from 'lucide-react'
import Icon from '../ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { achievementProgress } from '../../utils/achievements.js'

export default function AchievementsGrid() {
  const { state } = useApp()
  const items = achievementProgress(state)
  const unlockedMap = state.achievements || {}

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {items.map((a, i) => {
        const unlocked = !!unlockedMap[a.id]
        return (
          <motion.div
            key={a.id}
            initial={{ opacity: 0, scale: 0.94 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.04 }}
            className={`relative rounded-xl2 border p-3.5 text-center ${
              unlocked ? 'border-warning/30 bg-warning/10' : 'border-line bg-white/[0.03]'
            }`}
          >
            <span
              className={`mx-auto flex h-12 w-12 items-center justify-center rounded-full ${
                unlocked ? 'bg-warning/20 text-warning' : 'bg-white/5 text-muted'
              }`}
            >
              {unlocked ? <Icon name={a.icon} size={22} /> : <Lock size={18} />}
            </span>
            <p className={`mt-2 text-sm font-semibold ${unlocked ? 'text-ink' : 'text-muted'}`}>{a.name}</p>
            <p className="mt-0.5 text-[11px] leading-tight text-muted">{a.desc}</p>
            {!unlocked && a.progress > 0 && (
              <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-white/10">
                <div className="h-full rounded-full bg-accent/60" style={{ width: `${Math.round(a.progress * 100)}%` }} />
              </div>
            )}
          </motion.div>
        )
      })}
    </div>
  )
}
