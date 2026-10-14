import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Save, CalendarDays, ChevronDown } from 'lucide-react'
import { PageHeader, Panel } from '../../components/ui/Section.jsx'
import Button from '../../components/ui/Button.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { todayKey, prettyDate } from '../../utils/date.js'

const FIELDS = [
  { key: 'reflection', label: "Today's reflection", placeholder: 'How did today go?' },
  { key: 'wentWell', label: 'What went well?', placeholder: 'A small win or good moment…' },
  { key: 'improve', label: 'What could improve?', placeholder: 'Something to adjust tomorrow…' },
  { key: 'intention', label: "Tomorrow's intention", placeholder: 'One thing you want to focus on…' },
]

function dateLabel(key) {
  const [y, m, d] = key.split('-').map(Number)
  return new Date(y, m - 1, d).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })
}

export default function Journal() {
  const { state, saveJournal } = useApp()
  const t = todayKey()
  const [form, setForm] = useState({ reflection: '', wentWell: '', improve: '', intention: '' })
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    const existing = (state.journal || {})[t]
    if (existing) setForm({ reflection: existing.reflection || '', wentWell: existing.wentWell || '', improve: existing.improve || '', intention: existing.intention || '' })
  }, [t]) // eslint-disable-line

  const set = (k, v) => { setForm((f) => ({ ...f, [k]: v })); setSaved(false) }

  const save = () => {
    saveJournal(t, form)
    setSaved(true)
  }

  const past = Object.entries(state.journal || {})
    .filter(([k]) => k !== t)
    .sort((a, b) => (a[0] < b[0] ? 1 : -1))

  const hasContent = Object.values(form).some((v) => v.trim())

  return (
    <div>
      <PageHeader title="Daily Journal" subtitle="A few lines a day keeps your mind clear." />

      <div className="grid gap-4 lg:grid-cols-3">
        <Panel className="lg:col-span-2">
          <div className="mb-4 flex items-center gap-2 text-accent">
            <CalendarDays size={18} />
            <span className="font-display font-semibold text-ink">{prettyDate()}</span>
          </div>
          <div className="space-y-4">
            {FIELDS.map((f) => (
              <div key={f.key}>
                <label className="text-sm text-muted">{f.label}</label>
                <textarea
                  value={form[f.key]}
                  onChange={(e) => set(f.key, e.target.value)}
                  placeholder={f.placeholder}
                  rows={f.key === 'reflection' ? 3 : 2}
                  className="mt-1 w-full resize-none rounded-xl2 border border-line bg-white/5 px-3.5 py-3 text-ink placeholder:text-muted/50 focus:border-accent focus:outline-none"
                />
              </div>
            ))}
          </div>
          <div className="mt-4 flex items-center justify-end gap-3">
            {saved && <span className="text-sm text-success">Saved ✓</span>}
            <Button onClick={save} disabled={!hasContent}>
              <Save size={16} /> Save entry
            </Button>
          </div>
        </Panel>

        <Panel>
          <p className="mb-3 font-display font-semibold text-ink">Past entries</p>
          {past.length === 0 ? (
            <p className="text-sm text-muted">Your saved reflections will appear here.</p>
          ) : (
            <div className="space-y-2">
              {past.map(([k, entry]) => (
                <PastEntry key={k} dateKey={k} entry={entry} />
              ))}
            </div>
          )}
        </Panel>
      </div>
    </div>
  )
}

function PastEntry({ dateKey, entry }) {
  const [open, setOpen] = useState(false)
  const preview = entry.reflection || entry.wentWell || entry.intention || '—'
  return (
    <div className="rounded-xl2 border border-line bg-white/5">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between gap-2 p-3 text-left">
        <div className="min-w-0">
          <p className="text-sm font-medium text-ink">{dateLabel(dateKey)}</p>
          {!open && <p className="truncate text-xs text-muted">{preview}</p>}
        </div>
        <ChevronDown size={16} className={`text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="space-y-2 px-3 pb-3 text-sm">
              {entry.reflection && <p className="text-muted"><span className="text-ink">Reflection: </span>{entry.reflection}</p>}
              {entry.wentWell && <p className="text-muted"><span className="text-ink">Went well: </span>{entry.wentWell}</p>}
              {entry.improve && <p className="text-muted"><span className="text-ink">Improve: </span>{entry.improve}</p>}
              {entry.intention && <p className="text-muted"><span className="text-ink">Intention: </span>{entry.intention}</p>}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
