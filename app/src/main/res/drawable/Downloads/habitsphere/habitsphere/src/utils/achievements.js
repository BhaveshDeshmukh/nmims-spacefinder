import { ACHIEVEMENTS } from '../data/defaults.js'
import { computeStreak, computeGarden, levelFromXp } from './gamification.js'

// Evaluate which achievements are currently unlocked from real state.
// Returns { unlocked: {id: true}, newlyUnlocked: [id...] } given previous map.
export function evaluateAchievements(state) {
  const habits = state.habits || []
  const totalCompletions = habits.reduce((s, h) => s + (h.completedDates || []).length, 0)
  const streak = computeStreak(habits)
  const garden = computeGarden(state)
  const level = levelFromXp(state.user?.xp || 0).level

  const waterGoalHits = Object.values(state.water || {}).filter(
    (v) => v >= (state.waterGoal || 3000)
  ).length
  const focusTotal = state.focusTotal || 0
  const journalCount = Object.keys(state.journal || {}).length
  const moodCount = Object.keys(state.moods || {}).length

  const unlocked = {}
  if (totalCompletions >= 1) unlocked.first_step = true
  if (streak >= 7) unlocked.flame_7 = true
  if (waterGoalHits >= 7) unlocked.hydration_hero = true
  if (focusTotal >= 20) unlocked.focus_master = true
  if (journalCount >= 7) unlocked.journal_keeper = true
  if (garden.health >= 80) unlocked.garden_bloom = true
  if (moodCount >= 5) unlocked.mood_mindful = true
  if (level >= 5) unlocked.level_5 = true

  return unlocked
}

export function achievementProgress(state) {
  const habits = state.habits || []
  const totalCompletions = habits.reduce((s, h) => s + (h.completedDates || []).length, 0)
  const streak = computeStreak(habits)
  const garden = computeGarden(state)
  const waterGoalHits = Object.values(state.water || {}).filter(
    (v) => v >= (state.waterGoal || 3000)
  ).length
  const focusTotal = state.focusTotal || 0
  const journalCount = Object.keys(state.journal || {}).length
  const moodCount = Object.keys(state.moods || {}).length

  const map = {
    first_step: Math.min(1, totalCompletions / 1),
    flame_7: Math.min(1, streak / 7),
    hydration_hero: Math.min(1, waterGoalHits / 7),
    focus_master: Math.min(1, focusTotal / 20),
    journal_keeper: Math.min(1, journalCount / 7),
    garden_bloom: Math.min(1, garden.health / 80),
    mood_mindful: Math.min(1, moodCount / 5),
    level_5: Math.min(1, (state.user?.xp || 0) / 1600),
  }
  return ACHIEVEMENTS.map((a) => ({ ...a, progress: map[a.id] || 0 }))
}
