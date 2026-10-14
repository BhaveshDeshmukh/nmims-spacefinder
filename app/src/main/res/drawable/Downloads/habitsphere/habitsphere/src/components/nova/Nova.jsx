import { motion } from 'framer-motion'
import { NOVA_MOOD_COLORS } from '../../utils/nova.js'

// Nova — an animated SVG orb companion. Its expression + glow react to mood.
export default function Nova({ mood = 'idle', size = 76 }) {
  const color = NOVA_MOOD_COLORS[mood] || '#A855F7'
  const eyeY = mood === 'sleeping' ? 0 : 0
  const sleeping = mood === 'sleeping'
  const happy = mood === 'happy' || mood === 'excited' || mood === 'celebrating'
  const concerned = mood === 'concerned'

  return (
    <motion.div
      className="relative inline-flex items-center justify-center"
      style={{ width: size, height: size }}
      animate={
        mood === 'celebrating'
          ? { y: [0, -8, 0], rotate: [0, -6, 6, 0] }
          : mood === 'excited'
          ? { scale: [1, 1.06, 1] }
          : { y: [0, -4, 0] }
      }
      transition={{ duration: mood === 'celebrating' ? 0.9 : 3.4, repeat: Infinity, ease: 'easeInOut' }}
    >
      <div
        className="absolute inset-0 rounded-full blur-xl"
        style={{ background: color, opacity: 0.4 }}
      />
      <svg viewBox="0 0 100 100" width={size} height={size} className="relative">
        <defs>
          <radialGradient id={`nova-${mood}`} cx="38%" cy="32%" r="70%">
            <stop offset="0%" stopColor="#F5F3FF" />
            <stop offset="45%" stopColor={color} />
            <stop offset="100%" stopColor="#3B0764" />
          </radialGradient>
        </defs>
        <circle cx="50" cy="50" r="38" fill={`url(#nova-${mood})`} />
        <ellipse cx="50" cy="50" rx="46" ry="16" fill="none" stroke={color} strokeOpacity="0.4" strokeWidth="1.6" transform="rotate(-20 50 50)" />
        {/* Eyes */}
        {sleeping ? (
          <>
            <path d="M34 48 q6 5 12 0" stroke="#0b0620" strokeWidth="3" fill="none" strokeLinecap="round" />
            <path d="M54 48 q6 5 12 0" stroke="#0b0620" strokeWidth="3" fill="none" strokeLinecap="round" />
          </>
        ) : (
          <>
            <circle cx="40" cy={46 + eyeY} r="4.4" fill="#0b0620" />
            <circle cx="60" cy={46 + eyeY} r="4.4" fill="#0b0620" />
            <circle cx="41.4" cy={44.6 + eyeY} r="1.4" fill="#fff" />
            <circle cx="61.4" cy={44.6 + eyeY} r="1.4" fill="#fff" />
          </>
        )}
        {/* Mouth */}
        {happy ? (
          <path d="M40 60 q10 10 20 0" stroke="#0b0620" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : concerned ? (
          <path d="M41 63 q9 -7 18 0" stroke="#0b0620" strokeWidth="3" fill="none" strokeLinecap="round" />
        ) : sleeping ? (
          <circle cx="50" cy="62" r="2.6" fill="#0b0620" />
        ) : (
          <path d="M42 61 q8 5 16 0" stroke="#0b0620" strokeWidth="3" fill="none" strokeLinecap="round" />
        )}
      </svg>
      {sleeping && (
        <span className="absolute -top-1 right-0 text-accent text-sm font-semibold select-none">z</span>
      )}
    </motion.div>
  )
}
