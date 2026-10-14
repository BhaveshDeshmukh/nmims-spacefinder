import { useMemo } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import '../../components/analytics/chartSetup.js'
import { baseOptions } from '../../components/analytics/chartSetup.js'
import { PageHeader, Panel, SectionHeader } from '../../components/ui/Section.jsx'
import StatTile from '../../components/dashboard/StatTile.jsx'
import WeeklyStory from '../../components/analytics/WeeklyStory.jsx'
import HabitDNA from '../../components/analytics/HabitDNA.jsx'
import AchievementsGrid from '../../components/analytics/AchievementsGrid.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { lastNDays, shortWeekday } from '../../utils/date.js'
import { completionForDay, weeklyCompletionRate, computeStreak } from '../../utils/gamification.js'
import { MOODS } from '../../data/defaults.js'

export default function Analytics() {
  const { state } = useApp()
  const days = lastNDays(7)
  const labels = days.map((k) => shortWeekday(k))

  const completionData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Completion %',
      data: days.map((k) => Math.round(completionForDay(state.habits || [], k).rate * 100)),
      backgroundColor: 'rgba(168,85,247,0.75)',
      hoverBackgroundColor: '#A855F7',
      borderRadius: 8,
      maxBarThickness: 34,
    }],
  }), [state.habits]) // eslint-disable-line

  const waterData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Litres',
      data: days.map((k) => +(((state.water || {})[k] || 0) / 1000).toFixed(2)),
      backgroundColor: 'rgba(59,130,246,0.7)',
      hoverBackgroundColor: '#3B82F6',
      borderRadius: 8,
      maxBarThickness: 34,
    }],
  }), [state.water]) // eslint-disable-line

  const moodData = useMemo(() => ({
    labels,
    datasets: [{
      label: 'Mood',
      data: days.map((k) => MOODS.find((m) => m.id === (state.moods || {})[k])?.score ?? null),
      borderColor: '#A855F7',
      backgroundColor: 'rgba(168,85,247,0.15)',
      pointBackgroundColor: '#A855F7',
      pointRadius: 4,
      tension: 0.4,
      fill: true,
      spanGaps: true,
    }],
  }), [state.moods]) // eslint-disable-line

  const rate = Math.round(weeklyCompletionRate(state.habits || [], 7) * 100)
  const streak = computeStreak(state.habits || [])
  const focusWeek = days.reduce((s, k) => s + ((state.focus || {})[k] || 0), 0)
  const totalCompletions = (state.habits || []).reduce((s, h) => s + (h.completedDates || []).length, 0)

  const moodOptions = { ...baseOptions, scales: { ...baseOptions.scales, y: { ...baseOptions.scales.y, min: 0, max: 5, ticks: { stepSize: 1, color: '#A1A1AA', callback: (v) => ['', '😣', '😔', '😐', '🙂', '🤩'][v] || v } } } }
  const pctOptions = { ...baseOptions, scales: { ...baseOptions.scales, y: { ...baseOptions.scales.y, max: 100, ticks: { color: '#A1A1AA', callback: (v) => v + '%' } } } }

  return (
    <div className="space-y-5">
      <PageHeader title="Analytics" subtitle="Your progress, visualized from real activity." />

      {/* Stat row */}
      <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
        <StatTile icon="Percent" label="Weekly completion" value={`${rate}%`} accent="#22C55E" />
        <StatTile icon="Flame" label="Current streak" value={`${streak}d`} accent="#F59E0B" />
        <StatTile icon="Timer" label="Focus this week" value={focusWeek} accent="#7C3AED" />
        <StatTile icon="CheckCircle2" label="Total completions" value={totalCompletions} accent="#A855F7" />
      </div>

      <WeeklyStory />

      {/* Charts */}
      <div className="grid gap-4 lg:grid-cols-2">
        <Panel>
          <SectionHeader title="Weekly habit completion" icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Icon name="BarChart3" size={18} /></span>} />
          <div style={{ height: 240 }}><Bar data={completionData} options={pctOptions} /></div>
        </Panel>
        <Panel>
          <SectionHeader title="Water intake" subtitle="Litres per day" icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Icon name="Droplets" size={18} /></span>} />
          <div style={{ height: 240 }}><Bar data={waterData} options={baseOptions} /></div>
        </Panel>
      </div>

      <Panel>
        <SectionHeader title="Mood trend" subtitle="How you've felt this week" icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Icon name="HeartPulse" size={18} /></span>} />
        <div style={{ height: 220 }}><Line data={moodData} options={moodOptions} /></div>
      </Panel>

      <HabitDNA />

      <Panel>
        <SectionHeader title="Achievements" subtitle="Milestones you've unlocked" icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-warning/15 text-warning"><Icon name="Trophy" size={18} /></span>} />
        <AchievementsGrid />
      </Panel>
    </div>
  )
}
