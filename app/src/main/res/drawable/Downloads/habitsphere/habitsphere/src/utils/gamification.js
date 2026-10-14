import { LEVELS } from '../data/defaults.js'
import { lastNDays, todayKey, keyFromOffset } from './date.js'

// ---- Levels & XP ---------------------------------------------------------
export function levelFromXp(xp = 0) {
  let current = LEVELS[0]
  for (const l of LEVELS) {
    if (xp >= l.xp) current = l
  }
  const next = LEVELS.find((l) => l.xp > xp) || null
  const floor = current.xp
  const ceil = next ? next.xp : current.xp
  const span = ceil - floor || 1
  const intoLevel = xp - floor
  const progress = next ? Math.min(100, Math.round((intoLevel / span) * 100)) : 100
  return {
    level: current.level,
    title: current.title,
    xp,
    floor,
    ceil,
    next,
    xpIntoLevel: intoLevel,
    xpForNext: next ? ceil - xp : 0,
    progress,
  }
}

// ---- Streak --------------------------------------------------------------
// A day "counts" toward the streak if at least one habit was completed that day.
export function computeStreak(habits = []) {
  const completedSet = new Set()
  habits.forEach((h) => (h.completedDates || []).forEach((d) => completedSet.add(d)))
  if (completedSet.size === 0) return 0
  let streak = 0
  // Allow the streak to be "alive" if today isn't done yet but yesterday was.
  const startOffset = completedSet.has(todayKey()) ? 0 : -1
  for (let i = startOffset; i > -400; i--) {
    if (completedSet.has(keyFromOffset(i))) streak += 1
    else break
  }
  return streak
}

// Per-habit streak (consecutive days ending today/yesterday).
export function habitStreak(habit) {
  const set = new Set(habit.completedDates || [])
  if (set.size === 0) return 0
  let streak = 0
  const startOffset = set.has(todayKey()) ? 0 : -1
  for (let i = startOffset; i > -400; i--) {
    if (set.has(keyFromOffset(i))) streak += 1
    else break
  }
  return streak
}

// ---- Completion helpers --------------------------------------------------
export function completionForDay(habits, dayKey) {
  if (!habits.length) return { done: 0, total: 0, rate: 0 }
  const done = habits.filter((h) => (h.completedDates || []).includes(dayKey)).length
  return { done, total: habits.length, rate: done / habits.length }
}

export function weeklyCompletionRate(habits, days = 7) {
  if (!habits.length) return 0
  const keys = lastNDays(days)
  let done = 0
  let total = 0
  keys.forEach((k) => {
    habits.forEach((h) => {
      total += 1
      if ((h.completedDates || []).includes(k)) done += 1
    })
  })
  return total ? done / total : 0
}

// ---- Growth Score --------------------------------------------------------
// A weighted, normalized 0-100 score derived only from real stored activity.
export function computeGrowthScore(state) {
  const t = todayKey()
  const habits = state.habits || []
  const today = completionForDay(habits, t)

  // 1. Today's habit completion (35%)
  const habitScore = habits.length ? today.rate : 0

  // 2. 7-day consistency (25%)
  const consistency = weeklyCompletionRate(habits, 7)

  // 3. Water progress today (15%)
  const waterToday = (state.water || {})[t] || 0
  const waterScore = Math.min(1, waterToday / (state.waterGoal || 3000))

  // 4. Mood logged today (10%)
  const moodScore = (state.moods || {})[t] ? 1 : 0

  // 5. Focus sessions today (10%)
  const focusToday = (state.focus || {})[t] || 0
  const focusScore = Math.min(1, focusToday / 2)

  // 6. Journal today (5%)
  const journalScore = (state.journal || {})[t] ? 1 : 0

  const raw =
    habitScore * 0.35 +
    consistency * 0.25 +
    waterScore * 0.15 +
    moodScore * 0.1 +
    focusScore * 0.1 +
    journalScore * 0.05

  return Math.round(raw * 100)
}

// ---- Garden --------------------------------------------------------------
// Garden health is a blend of recent consistency and growth score, so the
// garden visibly reacts to real behaviour.
export function computeGarden(state) {
  const consistency = weeklyCompletionRate(state.habits || [], 14)
  const growth = computeGrowthScore(state) / 100
  const health = Math.round((consistency * 0.65 + growth * 0.35) * 100)

  let stage = 'seed'
  if (health >= 81) stage = 'garden'
  else if (health >= 61) stage = 'tree'
  else if (health >= 41) stage = 'plant'
  else if (health >= 21) stage = 'sprout'

  // Plants earned: one per ~5-day mini-streak of activity, capped.
  const plants = Math.max(1, Math.min(6, Math.round(health / 16)))
  const growthStreak = computeStreak(state.habits || [])

  return { health, stage, plants, growthStreak }
}

export const GARDEN_STAGES = {
  seed: { label: 'Seed', range: '0–20%' },
  sprout: { label: 'Sprout', range: '21–40%' },
  plant: { label: 'Plant', range: '41–60%' },
  tree: { label: 'Tree', range: '61–80%' },
  garden: { label: 'Blooming Garden', range: '81–100%' },
}

// ---- Recovery Mode -------------------------------------------------------
// Trigger when the last 3 days show very low completion but the user has habits.
export function needsRecovery(state) {
  const habits = state.habits || []
  if (habits.length === 0) return false
  const keys = lastNDays(3)
  let low = 0
  keys.forEach((k) => {
    const c = completionForDay(habits, k)
    if (c.rate < 0.34) low += 1
  })
  return low >= 3 && state.recoveryDismissed !== todayKey()
}
