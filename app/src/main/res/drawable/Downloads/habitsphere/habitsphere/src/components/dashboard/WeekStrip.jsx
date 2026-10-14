import { useApp } from '../../context/AppContext.jsx'
import { lastNDays, shortWeekday, todayKey } from '../../utils/date.js'
import { completionForDay } from '../../utils/gamification.js'

// Compact 7-day completion strip used on the dashboard.
export default function WeekStrip() {
  const { state } = useApp()
  const days = lastNDays(7).map((k) => ({
    key: k,
    ...completionForDay(state.habits || [], k),
    isToday: k === todayKey(),
  }))

  return (
    <div className="flex items-end justify-between gap-2" style={{ height: 96 }}>
      {days.map((d) => {
        const pct = Math.round(d.rate * 100)
        return (
          <div key={d.key} className="flex flex-1 flex-col items-center gap-1.5">
            <div className="flex w-full flex-1 items-end overflow-hidden rounded-lg bg-white/5">
              <div
                className="w-full rounded-lg transition-all"
                style={{
                  height: `${Math.max(6, pct)}%`,
                  background: d.isToday
                    ? 'linear-gradient(180deg,#A855F7,#7C3AED)'
                    : 'linear-gradient(180deg,rgba(168,85,247,0.6),rgba(124,58,237,0.5))',
                  boxShadow: d.isToday ? '0 0 14px rgba(168,85,247,0.6)' : 'none',
                }}
                title={`${d.done}/${d.total} habits`}
              />
            </div>
            <span className={`text-[10px] ${d.isToday ? 'text-accent font-semibold' : 'text-muted'}`}>
              {shortWeekday(d.key).charAt(0)}
            </span>
          </div>
        )
      })}
    </div>
  )
}
