import { motion } from 'framer-motion'

// A procedural garden rendered entirely with SVG — no external images.
// Number and maturity of plants scale with `health` (0-100) and `stage`.

function Plant({ x, maturity, delay = 0, hue = 142 }) {
  // maturity 0..1 controls stem height, leaf spread and bloom.
  const stem = 10 + maturity * 46
  const leaf = 6 + maturity * 12
  const bloom = maturity > 0.72
  const sprout = maturity <= 0.28
  const green = `hsl(${hue} 60% 45%)`
  const greenLight = `hsl(${hue} 55% 58%)`
  return (
    <motion.g
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      style={{ transformOrigin: `${x}px 150px` }}
    >
      {/* stem */}
      <motion.path
        d={`M${x} 150 C ${x - 3} ${150 - stem * 0.5}, ${x + 3} ${150 - stem * 0.7}, ${x} ${150 - stem}`}
        stroke={green}
        strokeWidth="3.4"
        fill="none"
        strokeLinecap="round"
        animate={{ rotate: [0, 1.5, -1.5, 0] }}
        transition={{ duration: 5 + delay, repeat: Infinity, ease: 'easeInOut' }}
        style={{ transformOrigin: `${x}px 150px` }}
      />
      {/* leaves */}
      {!sprout && (
        <>
          <ellipse cx={x - leaf * 0.7} cy={150 - stem * 0.55} rx={leaf} ry={leaf * 0.5} fill={greenLight} transform={`rotate(-30 ${x - leaf * 0.7} ${150 - stem * 0.55})`} />
          <ellipse cx={x + leaf * 0.7} cy={150 - stem * 0.72} rx={leaf} ry={leaf * 0.5} fill={green} transform={`rotate(30 ${x + leaf * 0.7} ${150 - stem * 0.72})`} />
        </>
      )}
      {sprout && (
        <>
          <ellipse cx={x - 4} cy={150 - stem} rx="5" ry="3" fill={greenLight} transform={`rotate(-35 ${x - 4} ${150 - stem})`} />
          <ellipse cx={x + 4} cy={150 - stem} rx="5" ry="3" fill={green} transform={`rotate(35 ${x + 4} ${150 - stem})`} />
        </>
      )}
      {/* bloom */}
      {bloom && (
        <g>
          {[0, 72, 144, 216, 288].map((a) => (
            <ellipse
              key={a}
              cx={x}
              cy={150 - stem - 7}
              rx="4.6"
              ry="8"
              fill="#C084FC"
              transform={`rotate(${a} ${x} ${150 - stem}) translate(0 -6)`}
              opacity="0.95"
            />
          ))}
          <circle cx={x} cy={150 - stem} r="4.5" fill="#F59E0B" />
        </g>
      )}
    </motion.g>
  )
}

export default function GardenScene({ health = 50, plants = 3, className = '', height = 200 }) {
  const count = Math.max(1, plants)
  const maturityBase = health / 100
  const positions = Array.from({ length: count }, (_, i) => {
    const spread = 260
    const x = 30 + (spread / Math.max(1, count - 0 + 1)) * (i + 1)
    // vary each plant's maturity a little around the base
    const m = Math.max(0.12, Math.min(1, maturityBase + ((i % 3) - 1) * 0.12))
    return { x, m, delay: i * 0.12, hue: 120 + (i % 3) * 18 }
  })

  return (
    <svg viewBox="0 0 320 200" className={`w-full ${className}`} style={{ height }} role="img" aria-label={`Habit garden at ${health}% health`}>
      <defs>
        <linearGradient id="sky" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#1E1B4B" stopOpacity="0.0" />
          <stop offset="100%" stopColor="#2E1065" stopOpacity="0.35" />
        </linearGradient>
        <radialGradient id="sun" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#A855F7" />
          <stop offset="100%" stopColor="#A855F7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="soil" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3B2F5E" />
          <stop offset="100%" stopColor="#1B1436" />
        </linearGradient>
      </defs>

      <rect x="0" y="0" width="320" height="200" fill="url(#sky)" />
      {/* glowing orb "sun" */}
      <circle cx="262" cy="46" r="46" fill="url(#sun)" opacity={0.5 + maturityBase * 0.4} />
      <circle cx="262" cy="46" r="13" fill="#C4B5FD" opacity={0.75} />

      {/* floating particles for a lively feel */}
      {[...Array(5)].map((_, i) => (
        <motion.circle
          key={i}
          cx={40 + i * 60}
          cy={60}
          r="1.8"
          fill="#A855F7"
          style={{ willChange: 'transform' }}
          animate={{ y: [0, -20, 0], opacity: [0.2, 0.8, 0.2] }}
          transition={{ duration: 4 + i, repeat: Infinity, ease: 'easeInOut', delay: i * 0.4 }}
        />
      ))}

      {/* ground */}
      <path d="M0 150 Q160 132 320 150 L320 200 L0 200 Z" fill="url(#soil)" />
      <path d="M0 150 Q160 132 320 150" stroke="#4C1D95" strokeWidth="2" fill="none" opacity="0.6" />

      {positions.map((p, i) => (
        <Plant key={i} x={p.x} maturity={p.m} delay={p.delay} hue={p.hue} />
      ))}
    </svg>
  )
}
