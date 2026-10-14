import { NavLink } from 'react-router-dom'
import { motion } from 'framer-motion'
import Icon from '../ui/Icon.jsx'
import { BOTTOM } from './nav.js'

export default function BottomNav() {
  return (
    <nav
      className="lg:hidden fixed bottom-0 inset-x-0 z-40 border-t border-line bg-surface/80 backdrop-blur-xl"
      style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      aria-label="Primary"
    >
      <div className="mx-auto flex max-w-md items-stretch justify-around px-2">
        {BOTTOM.map((n) => (
          <NavLink key={n.to} to={n.to} className="flex-1">
            {({ isActive }) => (
              <div className="relative flex flex-col items-center gap-1 py-2.5">
                {isActive && (
                  <motion.span
                    layoutId="bottom-active"
                    className="absolute -top-px h-0.5 w-8 rounded-full bg-accent shadow-glow"
                  />
                )}
                <Icon
                  name={n.icon}
                  size={21}
                  className={isActive ? 'text-accent' : 'text-muted'}
                />
                <span className={`text-[10px] ${isActive ? 'text-ink' : 'text-muted'}`}>
                  {n.label}
                </span>
              </div>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}
