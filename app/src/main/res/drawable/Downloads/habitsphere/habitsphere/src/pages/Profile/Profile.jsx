import { useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, Pencil, Settings as SettingsIcon } from 'lucide-react'
import { PageHeader, Panel, SectionHeader } from '../../components/ui/Section.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import ProgressRing from '../../components/ui/ProgressRing.jsx'
import AchievementsGrid from '../../components/analytics/AchievementsGrid.jsx'
import Icon from '../../components/ui/Icon.jsx'
import Button from '../../components/ui/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { computeGrowthScore } from '../../utils/gamification.js'
import { GOALS } from '../../data/defaults.js'

export default function Profile() {
  const { state, level, streak, setName } = useApp()
  const [editing, setEditing] = useState(false)
  const [name, setNameInput] = useState(state.user?.name || '')
  const growth = computeGrowthScore(state)
  const goal = GOALS.find((g) => g.id === state.user?.goal)
  const unlockedCount = Object.keys(state.achievements || {}).length

  const save = () => { setName(name); setEditing(false) }

  return (
    <div className="space-y-5">
      <PageHeader
        title="Profile"
        right={
          <Link to="/settings" className="inline-flex items-center gap-1.5 rounded-xl2 border border-line bg-white/5 px-3 py-2 text-sm text-ink hover:bg-white/10">
            <SettingsIcon size={16} /> Settings
          </Link>
        }
      />

      <Panel className="flex flex-col items-center gap-5 sm:flex-row sm:items-center">
        <div className="flex h-24 w-24 flex-shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-primary to-accent text-4xl font-bold text-white shadow-glow">
          {(state.user?.name || 'U').charAt(0).toUpperCase()}
        </div>
        <div className="flex-1 text-center sm:text-left">
          {editing ? (
            <div className="flex items-center gap-2">
              <input
                value={name}
                onChange={(e) => setNameInput(e.target.value)}
                className="rounded-xl2 border border-line bg-white/5 px-3 py-2 text-ink focus:border-accent focus:outline-none"
                autoFocus
                onKeyDown={(e) => e.key === 'Enter' && save()}
              />
              <Button onClick={save}><Check size={16} /></Button>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2 sm:justify-start">
              <h2 className="font-display text-2xl font-bold text-ink">{state.user?.name || 'Friend'}</h2>
              <button onClick={() => { setNameInput(state.user?.name || ''); setEditing(true) }} aria-label="Edit name" className="rounded-lg p-1.5 text-muted hover:bg-white/10 hover:text-ink">
                <Pencil size={15} />
              </button>
            </div>
          )}
          <div className="mt-1 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
            <span className="rounded-full bg-primary/20 px-2.5 py-1 text-xs font-semibold text-accent border border-accent/25">
              Level {level.level} · {level.title}
            </span>
            {goal && (
              <span className="inline-flex items-center gap-1 rounded-full bg-white/5 px-2.5 py-1 text-xs text-muted">
                <Icon name={goal.icon} size={12} /> {goal.label}
              </span>
            )}
          </div>
          <div className="mx-auto mt-3 max-w-sm sm:mx-0">
            <div className="flex justify-between text-xs text-muted">
              <span>{state.user?.xp || 0} XP</span>
              <span>{level.next ? `Next: Lv ${level.next.level}` : 'Max level'}</span>
            </div>
            <div className="mt-1"><ProgressBar value={level.progress} height={7} /></div>
          </div>
        </div>
        <ProgressRing value={growth} size={96} stroke={9}>
          <span className="font-display text-2xl font-bold text-ink">{growth}</span>
          <span className="text-[10px] text-muted">Growth</span>
        </ProgressRing>
      </Panel>

      {/* Stats */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        {[
          { icon: 'Flame', label: 'Streak', value: `${streak}d`, accent: '#F59E0B' },
          { icon: 'Zap', label: 'Total XP', value: state.user?.xp || 0, accent: '#A855F7' },
          { icon: 'Trophy', label: 'Achievements', value: unlockedCount, accent: '#22C55E' },
          { icon: 'ListChecks', label: 'Habits', value: (state.habits || []).length, accent: '#7C3AED' },
        ].map((s) => (
          <div key={s.label} className="surface rounded-xl2 p-4 text-center">
            <span className="mx-auto flex h-10 w-10 items-center justify-center rounded-xl2" style={{ background: `${s.accent}22`, color: s.accent }}>
              <Icon name={s.icon} size={18} />
            </span>
            <p className="mt-2 font-display text-2xl font-bold text-ink">{s.value}</p>
            <p className="text-xs text-muted">{s.label}</p>
          </div>
        ))}
      </div>

      <Panel>
        <SectionHeader title="Achievements" subtitle={`${unlockedCount} unlocked`} icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-warning/15 text-warning"><Icon name="Trophy" size={18} /></span>} />
        <AchievementsGrid />
      </Panel>
    </div>
  )
}
