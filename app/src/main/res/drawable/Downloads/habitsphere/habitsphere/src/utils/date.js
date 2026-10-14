// Date helpers — all keyed to local time, formatted as YYYY-MM-DD.

export function todayKey(d = new Date()) {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

export function keyFromOffset(offset, base = new Date()) {
  const d = new Date(base)
  d.setDate(d.getDate() + offset)
  return todayKey(d)
}

// Returns array of the last `n` day-keys ending today (oldest first).
export function lastNDays(n, base = new Date()) {
  const out = []
  for (let i = n - 1; i >= 0; i--) out.push(keyFromOffset(-i, base))
  return out
}

export function shortWeekday(key) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, { weekday: 'short' })
}

export function longWeekday(key) {
  const [y, m, d] = key.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return date.toLocaleDateString(undefined, { weekday: 'long' })
}

export function prettyDate(d = new Date()) {
  return d.toLocaleDateString(undefined, {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  })
}

export function greetingForHour(h = new Date().getHours()) {
  if (h < 5) return 'Good night'
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  if (h < 21) return 'Good evening'
  return 'Good night'
}

export function hourFromISO(iso) {
  return new Date(iso).getHours()
}

export function isWeekend(key) {
  const [y, m, d] = key.split('-').map(Number)
  const day = new Date(y, m - 1, d).getDay()
  return day === 0 || day === 6
}
