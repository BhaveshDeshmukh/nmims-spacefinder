import { useEffect, useState } from 'react'
import { Trash2 } from 'lucide-react'
import Modal from '../ui/Modal.jsx'
import Button from '../ui/Button.jsx'
import Icon from '../ui/Icon.jsx'
import { HABIT_CATEGORIES, HABIT_ICON_CHOICES } from '../../data/defaults.js'
import { useApp } from '../../context/AppContext.jsx'

const EMPTY = { name: '', icon: 'Target', category: 'Health', frequency: 'daily', reminder: '09:00' }

export default function HabitModal({ open, onClose, editing }) {
  const { addHabit, editHabit, deleteHabit } = useApp()
  const [form, setForm] = useState(EMPTY)

  useEffect(() => {
    if (open) setForm(editing ? { ...EMPTY, ...editing } : EMPTY)
  }, [open, editing])

  const set = (k, v) => setForm((f) => ({ ...f, [k]: v }))

  const submit = () => {
    if (editing) editHabit(editing.id, form)
    else addHabit(form)
    onClose()
  }

  const remove = () => {
    deleteHabit(editing.id)
    onClose()
  }

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit habit' : 'New habit'}>
      <div className="space-y-4">
        <div>
          <label className="text-sm text-muted">Name</label>
          <input
            value={form.name}
            onChange={(e) => set('name', e.target.value)}
            placeholder="e.g. Morning run"
            autoFocus
            className="mt-1 w-full rounded-xl2 border border-line bg-white/5 px-3.5 py-2.5 text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
            onKeyDown={(e) => e.key === 'Enter' && form.name.trim() && submit()}
          />
        </div>

        <div>
          <label className="text-sm text-muted">Icon</label>
          <div className="mt-1 grid grid-cols-9 gap-1.5">
            {HABIT_ICON_CHOICES.map((ic) => (
              <button
                key={ic}
                onClick={() => set('icon', ic)}
                aria-label={`Icon ${ic}`}
                className={`flex aspect-square items-center justify-center rounded-lg border transition ${
                  form.icon === ic ? 'border-accent bg-primary/25 text-accent' : 'border-line bg-white/5 text-muted hover:text-ink'
                }`}
              >
                <Icon name={ic} size={16} />
              </button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="text-sm text-muted">Category</label>
            <select
              value={form.category}
              onChange={(e) => set('category', e.target.value)}
              className="mt-1 w-full rounded-xl2 border border-line bg-white/5 px-3 py-2.5 text-ink focus:border-accent focus:outline-none"
            >
              {HABIT_CATEGORIES.map((c) => (
                <option key={c} value={c} className="bg-surface">{c}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm text-muted">Frequency</label>
            <select
              value={form.frequency}
              onChange={(e) => set('frequency', e.target.value)}
              className="mt-1 w-full rounded-xl2 border border-line bg-white/5 px-3 py-2.5 text-ink focus:border-accent focus:outline-none"
            >
              <option value="daily" className="bg-surface">Daily</option>
              <option value="weekdays" className="bg-surface">Weekdays</option>
              <option value="weekly" className="bg-surface">Weekly</option>
            </select>
          </div>
        </div>

        <div>
          <label className="text-sm text-muted">Reminder time</label>
          <input
            type="time"
            value={form.reminder}
            onChange={(e) => set('reminder', e.target.value)}
            className="mt-1 w-full rounded-xl2 border border-line bg-white/5 px-3.5 py-2.5 text-ink focus:border-accent focus:outline-none [color-scheme:dark]"
          />
        </div>

        <div className="flex items-center justify-between gap-3 pt-1">
          {editing ? (
            <Button variant="danger" onClick={remove}>
              <Trash2 size={16} /> Delete
            </Button>
          ) : (
            <span />
          )}
          <div className="flex gap-2">
            <Button variant="ghost" onClick={onClose}>Cancel</Button>
            <Button onClick={submit} disabled={!form.name.trim()}>
              {editing ? 'Save' : 'Add habit'}
            </Button>
          </div>
        </div>
      </div>
    </Modal>
  )
}
