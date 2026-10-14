import { Link, useLocation } from 'react-router-dom'
import Sphere from '../ui/Sphere.jsx'
import Icon from '../ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'

export default function MobileTopBar() {
  const { state, streak } = useApp()
  const loc = useLocation()
  const initial = (state.user?.name || 'U').charAt(0).toUpperCase()
  return (
    <header className="lg:hidden sticky top-0 z-30 flex items-center justify-between border-b border-line bg-bg/70 px-4 py-3 backdrop-blur-xl">
      <Link to="/dashboard" className="flex items-center gap-2">
        <Sphere size={28} orbit={false} />
        <span className="font-display font-bold text-ink">
          Habit<span className="text-accent">Sphere</span>
        </span>
      </Link>
      <div className="flex items-center gap-3">
        <span className="inline-flex items-center gap-1 text-sm text-warning">
          <Icon name="Flame" size={15} /> {streak}
        </span>
        <Link
          to="/profile"
          aria-label="Profile"
          className={`flex h-9 w-9 items-center justify-center rounded-full bg-primary/25 text-sm font-bold text-accent border border-accent/30 ${
            loc.pathname === '/profile' ? 'ring-2 ring-accent' : ''
          }`}
        >
          {initial}
        </Link>
      </div>
    </header>
  )
}
