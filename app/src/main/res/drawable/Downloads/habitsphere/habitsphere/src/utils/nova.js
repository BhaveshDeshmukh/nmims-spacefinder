import { completionForDay, computeStreak, computeGrowthScore } from './gamification.js'
import { todayKey } from './date.js'
import { MOODS } from '../data/defaults.js'

// Nova is a local, rule-based companion. It reads real app state and returns a
// mood + message. No AI backend is claimed or used.

export function novaState(state, context = {}) {
  const t = todayKey()
  const habits = state.habits || []
  const today = completionForDay(habits, t)
  const streak = computeStreak(habits)
  const growth = computeGrowthScore(state)
  const moodId = (state.moods || {})[t]
  const mood = MOODS.find((m) => m.id === moodId)

  // Highest-priority reactive states first.
  if (context.justCelebrated) {
    return { mood: 'celebrating', line: 'New streak record! You are unstoppable.' }
  }
  if (context.justCompleted && today.total > 0 && today.done === today.total) {
    return { mood: 'excited', line: "Every habit done today. That's a perfect day!" }
  }
  if (mood && mood.score <= 2) {
    return { mood: 'concerned', line: 'Take a breath. One small win is enough for today.' }
  }
  if (today.total === 0) {
    return { mood: 'idle', line: "Let's add a habit to start growing today." }
  }
  if (today.rate >= 0.75) {
    return { mood: 'happy', line: "You're on fire today. Keep going!" }
  }
  if (today.rate >= 0.4) {
    return { mood: 'encouraging', line: `Nice momentum — ${today.total - today.done} to go. You've got this.` }
  }
  if (streak >= 3 && today.done === 0) {
    return { mood: 'encouraging', line: `Your ${streak}-day streak is waiting. One habit keeps it alive.` }
  }
  if (growth < 30) {
    return { mood: 'encouraging', line: "Don't worry about yesterday. Let's make today easier." }
  }
  const hour = new Date().getHours()
  if (hour >= 21 || hour < 5) {
    return { mood: 'sleeping', line: 'Winding down? A little reflection makes tomorrow lighter.' }
  }
  return { mood: 'idle', line: 'Ready when you are. Small steps, big change.' }
}

export const NOVA_MOOD_COLORS = {
  idle: '#A855F7',
  happy: '#22C55E',
  excited: '#A855F7',
  encouraging: '#7C3AED',
  sleeping: '#60A5FA',
  celebrating: '#F59E0B',
  concerned: '#60A5FA',
}
