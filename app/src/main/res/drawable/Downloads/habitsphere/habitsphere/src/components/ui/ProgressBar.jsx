import { motion } from 'framer-motion'

export default function ProgressBar({ value = 0, className = '', height = 8, glow = true }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div
      className={`w-full overflow-hidden rounded-full bg-white/10 ${className}`}
      style={{ height }}
      role="progressbar"
      aria-valuenow={Math.round(v)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      <motion.div
        className="h-full rounded-full"
        style={{
          background: 'linear-gradient(90deg,#7C3AED,#A855F7)',
          boxShadow: glow ? '0 0 14px rgba(168,85,247,0.6)' : 'none',
        }}
        initial={{ width: 0 }}
        animate={{ width: `${v}%` }}
        transition={{ type: 'spring', stiffness: 120, damping: 20 }}
      />
    </div>
  )
}
