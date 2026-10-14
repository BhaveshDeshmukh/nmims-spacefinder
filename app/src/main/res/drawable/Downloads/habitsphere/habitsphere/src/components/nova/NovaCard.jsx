import { motion, AnimatePresence } from 'framer-motion'
import { useApp } from '../../context/AppContext.jsx'
import Nova from './Nova.jsx'

export default function NovaCard({ compact = false }) {
  const { nova } = useApp()
  return (
    <div className={`surface rounded-xl3 ${compact ? 'p-4' : 'p-5'} flex items-center gap-4 shadow-soft`}>
      <Nova mood={nova.mood} size={compact ? 58 : 72} />
      <div className="min-w-0">
        <div className="flex items-center gap-2">
          <span className="font-display font-semibold text-ink">Nova</span>
          <span className="text-[11px] uppercase tracking-wide text-accent/80 rounded-full bg-accent/10 px-2 py-0.5">
            {nova.mood}
          </span>
        </div>
        <AnimatePresence mode="wait">
          <motion.p
            key={nova.line}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-muted mt-0.5 leading-snug"
          >
            {nova.line}
          </motion.p>
        </AnimatePresence>
      </div>
    </div>
  )
}
