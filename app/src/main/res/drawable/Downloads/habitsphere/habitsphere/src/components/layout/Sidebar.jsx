import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '../ui/Icon.jsx'
import Sphere from '../ui/Sphere.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import { NAV, SECONDARY } from './nav.js'
import { useApp } from '../../context/AppContext.jsx'

function Item({ to, label, icon }) {
  return (
    <NavLink to={to} className="block">
      {({ isActive }) => (
        <div
          className={`group relative flex items-center gap-3 rounded-xl2 px-3 py-2.5 text-sm font-medium transition-colors ${
            isActive ? 'text-white' : 'text-muted hover:text-ink'
          }`}
        >
          {isActive && (
            <motion.span
              layoutId="side-active"
              className="absolute inset-0 rounded-xl2 bg-primary/20 border border-accent/30"
              transition={{ type: 'spring', stiffness: 300, damping: 28 }}
            />
          )}
          <Icon name={icon} size={19} className="relative z-10" />
          <span className="relative z-10">{label}</span>
        </div>
      )}
    </NavLink>
  )
}

export default function Sidebar() {
  const { state, level, streak } = useApp()
  return (
    <aside className="hidden lg:flex fixed inset-y-0 left-0 z-40 w-64 flex-col border-r border-line bg-surface/40 backdrop-blur-xl px-4 py-6">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <Sphere size={34} />
        <span className="font-display text-xl font-bold text-ink">
          Habit<span className="text-accent">Sphere</span>
        </span>
      </div>

      <nav className="flex flex-col gap-1">
        {NAV.map((n) => (
          <Item key={n.to} {...n} />
        ))}
      </nav>

      <div className="my-4 h-px bg-line" />

      <nav className="flex flex-col gap-1">
        {SECONDARY.map((n) => (
          <Item key={n.to} {...n} />
        ))}
      </nav>

      <div className="mt-auto surface rounded-xl2 p-3.5">
        <div className="flex items-center justify-between">
          <span className="text-xs text-muted">Level {level.level}</span>
          <span className="text-xs text-accent font-semibold">{level.title}</span>
        </div>
        <div className="mt-2">
          <ProgressBar value={level.progress} height={6} />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs text-muted">
          <span>{state.user?.xp || 0} XP</span>
          <span className="inline-flex items-center gap-1 text-warning">
            <Icon name="Flame" size={13} /> {streak}d
          </span>
        </div>
      </div>
    </aside>
  )
}
