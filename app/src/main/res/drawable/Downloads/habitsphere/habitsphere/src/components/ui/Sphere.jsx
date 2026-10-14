// The HabitSphere brand motif: a glowing purple sphere with an orbiting dot.
export default function Sphere({ size = 40, orbit = true, className = '' }) {
  return (
    <span
      className={`relative inline-flex items-center justify-center ${className}`}
      style={{ width: size, height: size }}
      aria-hidden
    >
      <span
        className="rounded-full"
        style={{
          width: size * 0.62,
          height: size * 0.62,
          background: 'radial-gradient(circle at 32% 28%, #C4B5FD, #7C3AED 55%, #4C1D95)',
          boxShadow: '0 0 18px rgba(168,85,247,0.75)',
        }}
      />
      {orbit && (
        <>
          <span
            className="absolute rounded-full border"
            style={{
              width: size,
              height: size * 0.42,
              borderColor: 'rgba(168,85,247,0.45)',
              transform: 'rotate(-24deg)',
            }}
          />
          <span
            className="absolute rounded-full animate-orbit"
            style={{
              width: 5,
              height: 5,
              background: '#A855F7',
              boxShadow: '0 0 8px #A855F7',
              // eslint-disable-next-line
              ['--r']: `${size * 0.42}px`,
            }}
          />
        </>
      )}
    </span>
  )
}
