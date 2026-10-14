import { useMemo, useState } from 'react'
import { Plus, Search } from 'lucide-react'
import { PageHeader } from '../../components/ui/Section.jsx'
import Button from '../../components/ui/Button.jsx'
import ProgressBar from '../../components/ui/ProgressBar.jsx'
import HabitRow from '../../components/habits/HabitRow.jsx'
import HabitModal from '../../components/habits/HabitModal.jsx'
import Icon from '../../components/ui/Icon.jsx'
import { useApp } from '../../context/AppContext.jsx'
import { completionForDay } from '../../utils/gamification.js'
import { todayKey } from '../../utils/date.js'
import { HABIT_CATEGORIES } from '../../data/defaults.js'

export default function Habits() {
  const { state } = useApp()
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(null)
  const [filter, setFilter] = useState('All')
  const [q, setQ] = useState('')

  const today = completionForDay(state.habits || [], todayKey())

  const filtered = useMemo(() => {
    return (state.habits || []).filter((h) => {
      const matchCat = filter === 'All' || h.category === filter
      const matchQ = !q || h.name.toLowerCase().includes(q.toLowerCase())
      return matchCat && matchQ
    })
  }, [state.habits, filter, q])

  const openNew = () => { setEditing(null); setOpen(true) }
  const openEdit = (h) => { setEditing(h); setOpen(true) }

  const cats = ['All', ...HABIT_CATEGORIES.filter((c) => (state.habits || []).some((h) => h.category === c))]

  return (
    <div>
      <PageHeader
        title="Habits"
        subtitle={`${today.done}/${today.total} completed today`}
        right={<Button onClick={openNew}><Plus size={16} /> New habit</Button>}
      />

      {today.total > 0 && (
        <div className="surface mb-5 rounded-xl3 p-4">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="text-muted">Today's progress</span>
            <span className="font-semibold text-ink">{Math.round(today.rate * 100)}%</span>
          </div>
          <ProgressBar value={today.rate * 100} height={9} />
        </div>
      )}

      {/* Controls */}
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center">
        <div className="relative flex-1">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Search habits"
            className="w-full rounded-xl2 border border-line bg-white/5 py-2.5 pl-9 pr-3 text-sm text-ink placeholder:text-muted/60 focus:border-accent focus:outline-none"
          />
        </div>
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {cats.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`whitespace-nowrap rounded-xl2 border px-3 py-2 text-sm transition ${
                filter === c ? 'border-accent bg-primary/20 text-ink' : 'border-line bg-white/5 text-muted hover:text-ink'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {/* List */}
      <div className="space-y-2.5">
        {(state.habits || []).length === 0 ? (
          <button onClick={openNew} className="flex w-full flex-col items-center gap-2 rounded-xl3 border border-dashed border-line py-14 text-muted hover:border-accent/40 hover:text-ink">
            <Icon name="Sparkles" size={26} />
            <span className="font-medium">No habits yet</span>
            <span className="text-sm">Tap to create your first habit</span>
          </button>
        ) : filtered.length === 0 ? (
          <p className="py-10 text-center text-muted">No habits match your search.</p>
        ) : (
          filtered.map((h) => <HabitRow key={h.id} habit={h} onEdit={openEdit} />)
        )}
      </div>

      <HabitModal open={open} onClose={() => setOpen(false)} editing={editing} />
    </div>
  )
}
