import { PageHeader, Panel } from '../../components/ui/Section.jsx'
import GardenScene from '../../components/garden/GardenScene.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import Icon from '../../components/ui/Icon.jsx'
import NovaCard from '../../components/nova/NovaCard.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { computeGarden, GARDEN_STAGES } from '../../utils/gamification.js'

const STAGE_ORDER = ['seed', 'sprout', 'plant', 'tree', 'garden']

export default function Garden() {
  const { state } = useApp()
  const garden = computeGarden(state)
  const stageIndex = STAGE_ORDER.indexOf(garden.stage)

  return (
    <div>
      <PageHeader
        title="Habit Garden"
        subtitle="Your consistency grows a living garden — every completed habit helps it bloom."
      />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="overflow-hidden rounded-xl2 border border-line bg-bg/30">
            <GardenScene health={garden.health} plants={garden.plants} height={300} />
          </div>
          <div className="mt-4 grid grid-cols-3 gap-3 text-center">
            <div className="surface rounded-xl2 p-3">
              <p className="font-display text-2xl font-bold text-success">{garden.health}%</p>
              <p className="text-xs text-muted">Garden Health</p>
            </div>
            <div className="surface rounded-xl2 p-3">
              <p className="font-display text-2xl font-bold text-ink">{garden.plants}</p>
              <p className="text-xs text-muted">Plants</p>
            </div>
            <div className="surface rounded-xl2 p-3">
              <p className="font-display text-2xl font-bold text-warning">{garden.growthStreak}d</p>
              <p className="text-xs text-muted">Growth streak</p>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel>
            <div className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-success/20 text-success"><Icon name="Sprout" size={18} /></span>
              <div>
                <p className="font-display font-semibold text-ink">{GARDEN_STAGES[garden.stage].label}</p>
                <p className="text-xs text-muted">Current stage · {GARDEN_STAGES[garden.stage].range}</p>
              </div>
            </div>
            <div className="mt-4">
              <ProgressBar value={garden.health} height={9} />
            </div>
          </Panel>

          <Panel>
            <p className="mb-3 font-display font-semibold text-ink">Growth stages</p>
            <div className="space-y-2.5">
              {STAGE_ORDER.map((s, i) => {
                const active = i === stageIndex
                const reached = i <= stageIndex
                return (
                  <div key={s} className={`flex items-center gap-3 rounded-xl2 border p-2.5 ${active ? 'border-accent bg-primary/15' : 'border-line'}`}>
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${reached ? 'bg-success/25 text-success' : 'bg-white/5 text-muted'}`}>
                      {reached ? <Icon name="Check" size={15} /> : i + 1}
                    </span>
                    <div className="flex-1">
                      <p className={`text-sm font-medium ${active ? 'text-ink' : 'text-muted'}`}>{GARDEN_STAGES[s].label}</p>
                    </div>
                    <span className="text-xs text-muted">{GARDEN_STAGES[s].range}</span>
                  </div>
                )
              })}
            </div>
          </Panel>

          <NovaCard compact />
        </div>
      </div>
    </div>
  )
}
