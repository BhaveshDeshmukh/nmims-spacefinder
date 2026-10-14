import { Link } from 'react-router-dom'
import { Plus, ArrowRight, Quote as QuoteIcon } from 'lucide-react'
import { Panel, SectionHeader } from '../../components/ui/Section.jsx'
import ProgressRing from '../../components/ui/ProgressRing.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import NovaCard from '../../components/nova/NovaCard.jsx'
import StatTile from '../../components/dashboard/StatTile.jsx'
import WeekStrip from '../../components/dashboard/WeekStrip.jsx'
import RecoveryBanner from '../../components/dashboard/RecoveryBanner.jsx'
import WaterTracker from '../../components/water/WaterTracker.jsx'
import MoodTracker from '../../components/mood/MoodTracker.jsx'
import HabitRow from '../../components/habits/HabitRow.jsx'
import GardenScene from '../../components/garden/GardenScene.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { greetingForHour, prettyDate, todayKey } from '../../utils/date.js'
import {
  computeGrowthScore,
  computeGarden,
  completionForDay,
} from '../../utils/gamification.js'
import { GARDEN_STAGES } from '../../utils/gamification.js'
import { achievementProgress } from '../../utils/achievements.js'
import { pickQuote } from '../../data/defaults.js'

export default function Dashboard() {
  const { state, level, streak } = useApp()
  const growth = computeGrowthScore(state)
  const garden = computeGarden(state)
  const today = completionForDay(state.habits || [], todayKey())
  const focusToday = (state.focus || {})[todayKey()] || 0
  const quote = pickQuote()
  const unlocked = achievementProgress(state).filter((a) => (state.achievements || {})[a.id])

  const name = state.user?.name || 'Friend'
  const todayHabits = state.habits || []

  return (
    <div className="space-y-5">
      {/* Greeting */}
      <div className="flex flex-col gap-1">
        <h1 className="font-display text-2xl md:text-3xl font-bold text-ink">
          {greetingForHour()}, <span className="text-gradient">{name}</span>
        </h1>
        <p className="text-muted">{prettyDate()}</p>
      </div>

      <RecoveryBanner />

      {/* Top row: Growth score + Nova + quick stats */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="flex items-center gap-5 lg:col-span-1">
          <ProgressRing value={growth} size={128} stroke={11}>
            <span className="font-display text-4xl font-bold text-ink leading-none">{growth}</span>
            <span className="text-xs text-muted mt-1">Growth Score</span>
          </ProgressRing>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="rounded-full bg-primary/20 px-2.5 py-1 text-xs font-semibold text-accent border border-accent/25">
                Lv {level.level} · {level.title}
              </span>
            </div>
            <div className="mt-3">
              <div className="flex justify-between text-xs text-muted">
                <span>{state.user?.xp || 0} XP</span>
                <span>{level.next ? `${level.xpForNext} to Lv ${level.next.level}` : 'Max level'}</span>
              </div>
              <div className="mt-1.5"><ProgressBar value={level.progress} height={7} /></div>
            </div>
            <div className="mt-3 flex items-center gap-1.5 text-sm text-warning">
              <Icon name="Flame" size={16} />
              <span className="font-semibold">{streak}-day streak</span>
            </div>
          </div>
        </Panel>

        <div className="lg:col-span-2 grid gap-4 sm:grid-cols-2">
          <NovaCard />
          <div className="grid grid-cols-2 gap-4">
            <StatTile icon="ListChecks" label="Today" value={`${today.done}/${today.total}`} sub="habits" accent="#22C55E" />
            <StatTile icon="Timer" label="Focus" value={focusToday} sub="sessions" accent="#F59E0B" />
          </div>
        </div>
      </div>

      {/* Middle: habits + right column */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <SectionHeader
            title="Today's habits"
            subtitle={today.total ? `${today.done} of ${today.total} complete` : 'No habits yet'}
            icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Icon name="ListChecks" size={18} /></span>}
            action={
              <Link to="/habits" className="inline-flex items-center gap-1 rounded-xl2 border border-line bg-white/5 px-3 py-2 text-sm text-ink hover:bg-white/10">
                <Plus size={15} /> Manage
              </Link>
            }
          />
          {today.total > 0 && (
            <div className="mb-4">
              <ProgressBar value={today.rate * 100} height={8} />
            </div>
          )}
          <div className="space-y-2.5">
            {todayHabits.length === 0 && (
              <Link to="/habits" className="flex items-center justify-center gap-2 rounded-xl2 border border-dashed border-line py-8 text-muted hover:text-ink hover:border-accent/40">
                <Plus size={18} /> Add your first habit
              </Link>
            )}
            {todayHabits.slice(0, 5).map((h) => (
              <HabitRow key={h.id} habit={h} />
            ))}
            {todayHabits.length > 5 && (
              <Link to="/habits" className="block pt-1 text-center text-sm text-accent hover:underline">
                +{todayHabits.length - 5} more
              </Link>
            )}
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel><WaterTracker /></Panel>
          <Panel><MoodTracker /></Panel>
        </div>
      </div>

      {/* Garden preview + weekly + achievements + quote */}
      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <SectionHeader
            title="Habit Garden"
            subtitle={`${GARDEN_STAGES[garden.stage].label} · ${garden.health}% health`}
            icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-success/20 text-success"><Icon name="Flower2" size={18} /></span>}
            action={<Link to="/garden" className="text-sm text-accent hover:underline inline-flex items-center gap-1">Open <ArrowRight size={14} /></Link>}
          />
          <div className="overflow-hidden rounded-xl2 border border-line bg-bg/30">
            <GardenScene health={garden.health} plants={garden.plants} height={188} />
          </div>
          <div className="mt-3 grid grid-cols-3 gap-3 text-center">
            <div><p className="font-display text-xl font-bold text-ink">{garden.health}%</p><p className="text-xs text-muted">Health</p></div>
            <div><p className="font-display text-xl font-bold text-ink">{garden.plants}</p><p className="text-xs text-muted">Plants</p></div>
            <div><p className="font-display text-xl font-bold text-ink">{garden.growthStreak}d</p><p className="text-xs text-muted">Growth streak</p></div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <SectionHeader title="This week" icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Icon name="BarChart3" size={18} /></span>} />
            <WeekStrip />
          </Panel>

          <Panel>
            <div className="flex items-center justify-between">
              <span className="font-display font-semibold text-ink">Achievements</span>
              <Link to="/profile" className="text-xs text-accent hover:underline">{unlocked.length} unlocked</Link>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {unlocked.length === 0 && <p className="text-sm text-muted">Complete a habit to unlock your first badge.</p>}
              {unlocked.slice(0, 6).map((a) => (
                <span key={a.id} title={a.name} className="flex h-10 w-10 items-center justify-center rounded-xl2 bg-warning/15 text-warning border border-warning/25">
                  <Icon name={a.icon} size={18} />
                </span>
              ))}
            </div>
          </Panel>
        </div>
      </div>

      {/* Quote */}
      <Panel className="flex items-start gap-4">
        <span className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-xl2 bg-primary/20 text-accent">
          <QuoteIcon size={18} />
        </span>
        <div>
          <p className="font-display text-lg text-ink leading-snug">“{quote.t}”</p>
          <p className="mt-1 text-sm text-muted">— {quote.a}</p>
        </div>
      </Panel>
    </div>
  )
}
