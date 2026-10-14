import { useState } from 'react'
import { Moon, Zap, Download, Trash2, Droplets, Target } from 'lucide-react'
import { PageHeader, Panel, SectionHeader } from '../../components/ui/Section.jsx'
import Button from '../../components/ui/Button.jsx'
import Modal from '../../components/ui/Modal.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { GOALS } from '../../data/defaults.js'

function Toggle({ checked, onChange, label }) {
  return (
    <button
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative h-7 w-12 flex-shrink-0 rounded-full transition-colors ${checked ? 'bg-primary' : 'bg-white/15'}`}
    >
      <span className={`absolute top-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${checked ? 'translate-x-5' : 'translate-x-0.5'}`} />
    </button>
  )
}

function Row({ icon, title, desc, children, accent = '#A855F7' }) {
  return (
    <div className="flex items-center justify-between gap-4 rounded-xl2 border border-line bg-white/5 p-4">
      <div className="flex items-center gap-3">
        <span className="flex h-10 w-10 items-center justify-center rounded-xl2" style={{ background: `${accent}22`, color: accent }}>
          {icon}
        </span>
        <div>
          <p className="font-medium text-ink">{title}</p>
          {desc && <p className="text-xs text-muted">{desc}</p>}
        </div>
      </div>
      {children}
    </div>
  )
}

export default function Settings() {
  const { state, updateSettings, setWaterGoal, setGoal, exportData, resetAll } = useApp()
  const [confirm, setConfirm] = useState(false)
  const s = state.settings || {}

  return (
    <div className="space-y-5">
      <PageHeader title="Settings" subtitle="Preferences, data, and personalization." />

      <Panel>
        <SectionHeader title="Appearance" icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Moon size={18} /></span>} />
        <div className="space-y-3">
          <Row icon={<Moon size={18} />} title="Dark mode" desc="HabitSphere is dark-first by design.">
            <Toggle checked={s.darkMode !== false} onChange={(v) => updateSettings({ darkMode: v })} label="Dark mode" />
          </Row>
          <Row icon={<Zap size={18} />} title="Reduced motion" desc="Minimize animations and background effects." accent="#F59E0B">
            <Toggle checked={!!s.reducedMotion} onChange={(v) => updateSettings({ reducedMotion: v })} label="Reduced motion" />
          </Row>
        </div>
      </Panel>

      <Panel>
        <SectionHeader title="Goals" icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Target size={18} /></span>} />
        <div className="space-y-4">
          <div>
            <div className="mb-2 flex items-center gap-2 text-sm text-muted"><Droplets size={15} /> Daily water goal</div>
            <div className="flex items-center gap-3">
              <input
                type="range"
                min={1000}
                max={5000}
                step={250}
                value={state.waterGoal || 3000}
                onChange={(e) => setWaterGoal(Number(e.target.value))}
                className="flex-1"
                aria-label="Daily water goal"
              />
              <span className="w-16 text-right font-semibold text-ink">{((state.waterGoal || 3000) / 1000).toFixed(2)}L</span>
            </div>
          </div>
          <div>
            <div className="mb-2 text-sm text-muted">Primary goal</div>
            <div className="no-scrollbar flex gap-2 overflow-x-auto">
              {GOALS.map((g) => (
                <button
                  key={g.id}
                  onClick={() => setGoal(g.id)}
                  className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-xl2 border px-3 py-2 text-sm transition ${
                    state.user?.goal === g.id ? 'border-accent bg-primary/20 text-ink' : 'border-line bg-white/5 text-muted hover:text-ink'
                  }`}
                >
                  <Icon name={g.icon} size={14} /> {g.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </Panel>

      <Panel>
        <SectionHeader title="Data" subtitle="Everything is stored locally on your device." icon={<span className="flex h-9 w-9 items-center justify-center rounded-xl2 bg-primary/20 text-accent"><Icon name="Database" size={18} /></span>} />
        <div className="space-y-3">
          <Row icon={<Download size={18} />} title="Export data" desc="Download a JSON backup of your progress." accent="#22C55E">
            <Button variant="ghost" onClick={exportData}><Download size={16} /> Export</Button>
          </Row>
          <Row icon={<Trash2 size={18} />} title="Reset all data" desc="Permanently clear all habits and progress." accent="#EF4444">
            <Button variant="danger" onClick={() => setConfirm(true)}><Trash2 size={16} /> Reset</Button>
          </Row>
        </div>
      </Panel>

      <p className="text-center text-xs text-muted">HabitSphere v1.0 · PixxelHack 2.0 · Frontend-only</p>

      <Modal open={confirm} onClose={() => setConfirm(false)} title="Reset all data?">
        <p className="text-sm text-muted">
          This permanently deletes every habit, mood, journal entry, and all progress on this device.
          This cannot be undone.
        </p>
        <div className="mt-5 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setConfirm(false)}>Cancel</Button>
          <Button variant="danger" onClick={() => { resetAll(); setConfirm(false) }}>
            <Trash2 size={16} /> Yes, reset everything
          </Button>
        </div>
      </Modal>
    </div>
  )
}
