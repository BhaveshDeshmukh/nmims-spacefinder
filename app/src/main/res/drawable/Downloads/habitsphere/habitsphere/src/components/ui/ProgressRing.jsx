// Animated circular progress ring (SVG) — used for Growth Score, water, etc.
export default function ProgressRing({
  value = 0,
  size = 140,
  stroke = 10,
  trackColor = 'rgba(255,255,255,0.08)',
  color = '#A855F7',
  gradient = true,
  children,
  label,
}) {
  const r = (size - stroke) / 2
  const c = 2 * Math.PI * r
  const clamped = Math.max(0, Math.min(100, value))
  const offset = c - (clamped / 100) * c
  const gid = `ring-${Math.round(size)}-${Math.round(clamped)}`

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <defs>
          <linearGradient id={gid} x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#7C3AED" />
            <stop offset="100%" stopColor="#A855F7" />
          </linearGradient>
        </defs>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke={trackColor} strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke={gradient ? `url(#${gid})` : color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 900ms cubic-bezier(0.22,1,0.36,1)' }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center text-center">
        {children}
        {label && <span className="text-xs text-muted mt-0.5">{label}</span>}
      </div>
    </div>
  )
}
