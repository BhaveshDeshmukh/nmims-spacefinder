import { Dna, Lock } from 'lucide-react'
import { Panel, SectionHeader } from '../ui/Section.jsx'
import ProgressBar from '../ui/ProgressBar.jsx'
import Icon from '../ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { habitDNA } from '../../utils/insights.js'

export default function HabitDNA() {
  const { state } = useApp()
  const dna = habitDNA(state)

  return (
    <Panel>
      <SectionHeader
        title="Habit DNA"
        subtitle="Insights derived only from your real activity"
        icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Dna size={18} /></span>}
      />

      {!dna.ready ? (
        <div className="rounded-xl2 border border-dashed border-line p-6 text-center">
          <Lock size={22} className="mx-auto text-muted" />
          <p className="mt-2 text-sm text-ink">Keep logging for {dna.remaining} more day{dna.remaining === 1 ? '' : 's'} to unlock your Habit DNA.</p>
          <div className="mx-auto mt-3 max-w-xs">
            <ProgressBar value={(dna.daysLogged / 7) * 100} height={7} />
          </div>
          <p className="mt-2 text-xs text-muted">{dna.daysLogged}/7 days of data</p>
        </div>
      ) : dna.insights.length === 0 ? (
        <p className="text-sm text-muted">Your patterns are still forming — check back after a few more varied days.</p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {dna.insights.map((ins, i) => (
            <div key={i} className="flex items-start gap-3 rounded-xl2 border border-line bg-white/5 p-3.5">
              <span className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-xl2 bg-accent/15 text-accent">
                <Icon name={ins.icon} size={17} />
              </span>
              <div>
                <p className="text-xs uppercase tracking-wide text-accent/80">{ins.title}</p>
                <p className="text-sm text-ink">{ins.text}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Panel>
  )
}
