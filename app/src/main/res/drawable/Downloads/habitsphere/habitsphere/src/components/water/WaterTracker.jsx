import { motion } from 'framer-motion'
import { Droplets, Plus, Minus } from 'lucide-react'
import { useApp } from '../../context/AppContext.jsx'
import { todayKey } from '../../utils/date.js'

function WaterGlass({ pct }) {
  const fill = Math.max(0, Math.min(100, pct))
  const level = 100 - fill // y position of water top (0 top .. 100 bottom)
  return (
    <div className="relative mx-auto h-36 w-24" aria-hidden>
      <svg viewBox="0 0 100 140" className="h-full w-full">
        <defs>
          <linearGradient id="waterFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#3B82F6" />
          </linearGradient>
          <clipPath id="glassClip">
            <path d="M20 8 L80 8 L72 132 Q72 138 66 138 L34 138 Q28 138 28 132 Z" />
          </clipPath>
        </defs>
        {/* glass body */}
        <path d="M20 8 L80 8 L72 132 Q72 138 66 138 L34 138 Q28 138 28 132 Z" fill="rgba(255,255,255,0.04)" stroke="rgba(255,255,255,0.15)" strokeWidth="2" />
        <g clipPath="url(#glassClip)">
          <motion.g animate={{ y: [0, 0] }}>
            <motion.path
              fill="url(#waterFill)"
              initial={false}
              animate={{ d: `M0 ${level + 6} Q25 ${level} 50 ${level + 6} T100 ${level + 6} V140 H0 Z` }}
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
              opacity="0.55"
            />
            <motion.path
              fill="url(#waterFill)"
              initial={false}
              animate={{ d: `M0 ${level + 10} Q25 ${level + 16} 50 ${level + 10} T100 ${level + 10} V140 H0 Z` }}
              transition={{ type: 'spring', stiffness: 60, damping: 14 }}
            />
          </motion.g>
        </g>
      </svg>
    </div>
  )
}

export default function WaterTracker({ compact = false }) {
  const { state, addWater } = useApp()
  const goal = state.waterGoal || 3000
  const intake = (state.water || {})[todayKey()] || 0
  const pct = Math.round((intake / goal) * 100)

  return (
    <div className="flex flex-col items-center">
      <div className="flex w-full items-center justify-between">
        <div className="flex items-center gap-2 text-accent">
          <Droplets size={18} />
          <span className="font-display font-semibold text-ink">Water</span>
        </div>
        <span className="text-sm text-muted">
          {(intake / 1000).toFixed(2)}L / {(goal / 1000).toFixed(0)}L
        </span>
      </div>

      <WaterGlass pct={pct} />

      <p className="mt-1 text-2xl font-bold text-ink">
        {Math.min(100, pct)}<span className="text-base text-muted">%</span>
      </p>

      <div className="mt-3 flex items-center gap-2">
        <button
          onClick={() => addWater(-250)}
          aria-label="Remove 250 millilitres"
          className="flex h-10 w-10 items-center justify-center rounded-xl2 border border-line bg-white/5 text-muted hover:text-ink hover:bg-white/10"
        >
          <Minus size={16} />
        </button>
        <button
          onClick={() => addWater(250)}
          className="rounded-xl2 border border-accent/40 bg-primary/25 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-primary/35"
        >
          +250 ml
        </button>
        <button
          onClick={() => addWater(500)}
          className="rounded-xl2 border border-accent/40 bg-primary/25 px-4 py-2.5 text-sm font-semibold text-ink hover:bg-primary/35"
        >
          +500 ml
        </button>
        <button
          onClick={() => addWater(250)}
          aria-label="Add 250 millilitres"
          className="flex h-10 w-10 items-center justify-center rounded-xl2 border border-line bg-white/5 text-muted hover:text-ink hover:bg-white/10"
        >
          <Plus size={16} />
        </button>
      </div>
    </div>
  )
}
