import { motion, AnimatePresence } from 'framer-motion'
import { Zap, Trophy, Star, Info } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'

const ICONS = {
  xp: Zap,
  achievement: Trophy,
  level: Star,
  info: Info,
}
const COLORS = {
  xp: '#A855F7',
  achievement: '#F59E0B',
  level: '#22C55E',
  info: '#7C3AED',
}

export default function Toasts() {
  const { toasts, dismissToast } = useApp()
  return (
    <div className="pointer-events-none fixed inset-x-0 top-3 z-[90] flex flex-col items-center gap-2 px-3 sm:top-4">
      <AnimatePresence>
        {toasts.map((t) => {
          const I = ICONS[t.type] || Info
          const c = COLORS[t.type] || '#7C3AED'
          return (
            <motion.button
              key={t.id}
              layout
              onClick={() => dismissToast(t.id)}
              initial={{ opacity: 0, y: -20, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -12, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 300, damping: 26 }}
              className="glass pointer-events-auto flex items-center gap-3 rounded-2xl px-4 py-2.5 shadow-glow"
            >
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full"
                style={{ background: `${c}22`, color: c }}
              >
                <I size={16} />
              </span>
              <span className="text-left">
                <span className="block text-sm font-semibold text-ink leading-tight">{t.title}</span>
                {t.sub && <span className="block text-xs text-muted">{t.sub}</span>}
              </span>
            </motion.button>
          )
        })}
      </AnimatePresence>
    </div>
  )
}
