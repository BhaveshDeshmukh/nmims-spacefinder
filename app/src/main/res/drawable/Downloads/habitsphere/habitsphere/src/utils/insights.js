import { MOODS } from '../data/defaults.js'
import { completionForDay } from './gamification.js'
import { isWeekend, lastNDays } from './date.js'

// Habit DNA — derives light behavioural insights ONLY from stored activity.
// Returns { ready, daysLogged, insights: [] } and never fabricates data.

export function habitDNA(state) {
  const habits = state.habits || []
  const activeDays = new Set()
  habits.forEach((h) => (h.completedDates || []).forEach((d) => activeDays.add(d)))
  const moodDays = Object.keys(state.moods || {})
  const daysLogged = new Set([...activeDays, ...moodDays]).size

  if (daysLogged < 7) {
    return {
      ready: false,
      daysLogged,
      remaining: 7 - daysLogged,
      insights: [],
    }
  }

  const insights = []

  // 1. Most consistent habit
  let best = null
  habits.forEach((h) => {
    const n = (h.completedDates || []).length
    if (!best || n > best.n) best = { name: h.name, n }
  })
  if (best && best.n > 0) {
    insights.push({
      icon: 'Award',
      title: 'Signature habit',
      text: `${best.name} is your most consistent habit.`,
    })
  }

  // 2. Weekday vs weekend completion
  const keys = lastNDays(21)
  let wkDone = 0, wkTotal = 0, weDone = 0, weTotal = 0
  keys.forEach((k) => {
    const c = completionForDay(habits, k)
    if (isWeekend(k)) { weDone += c.done; weTotal += c.total }
    else { wkDone += c.done; wkTotal += c.total }
  })
  const wkRate = wkTotal ? wkDone / wkTotal : 0
  const weRate = weTotal ? weDone / weTotal : 0
  if (Math.abs(wkRate - weRate) > 0.12) {
    insights.push({
      icon: 'CalendarDays',
      title: 'Your rhythm',
      text: wkRate > weRate
        ? 'You complete more habits on weekdays.'
        : 'You complete more habits on weekends.',
    })
  }

  // 3. Best day of week
  const byDay = {}
  keys.forEach((k) => {
    const [y, m, d] = k.split('-').map(Number)
    const dow = new Date(y, m - 1, d).getDay()
    const c = completionForDay(habits, k)
    byDay[dow] = byDay[dow] || { done: 0, total: 0 }
    byDay[dow].done += c.done
    byDay[dow].total += c.total
  })
  let bestDow = null
  Object.entries(byDay).forEach(([dow, v]) => {
    const r = v.total ? v.done / v.total : 0
    if (!bestDow || r > bestDow.r) bestDow = { dow: Number(dow), r }
  })
  if (bestDow) {
    const name = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][bestDow.dow]
    insights.push({
      icon: 'TrendingUp',
      title: 'Peak day',
      text: `${name} is usually your strongest day.`,
    })
  }

  // 4. Mood vs completion correlation
  const moods = state.moods || {}
  let hiMood = [], loMood = []
  Object.entries(moods).forEach(([k, id]) => {
    const c = completionForDay(habits, k)
    const m = MOODS.find((x) => x.id === id)
    if (!m) return
    if (c.rate >= 0.6) hiMood.push(m.score)
    else loMood.push(m.score)
  })
  if (hiMood.length >= 2 && loMood.length >= 2) {
    const avg = (a) => a.reduce((s, x) => s + x, 0) / a.length
    if (avg(hiMood) - avg(loMood) > 0.4) {
      insights.push({
        icon: 'HeartPulse',
        title: 'Mind & habits',
        text: 'Your mood is usually better on high-completion days.',
      })
    }
  }

  return { ready: true, daysLogged, remaining: 0, insights: insights.slice(0, 4) }
}
