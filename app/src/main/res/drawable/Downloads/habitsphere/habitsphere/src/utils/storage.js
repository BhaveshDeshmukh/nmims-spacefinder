import { STORAGE_KEY, STATE_VERSION, buildFreshState } from '../data/defaults.js'

// Centralized, versioned, crash-safe LocalStorage access.

export function loadState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (!parsed || typeof parsed !== 'object') return null
    return migrate(parsed)
  } catch (err) {
    console.warn('HabitSphere: could not read saved state, starting fresh.', err)
    return null
  }
}

export function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
    return true
  } catch (err) {
    console.warn('HabitSphere: could not save state.', err)
    return false
  }
}

export function resetState() {
  try {
    localStorage.removeItem(STORAGE_KEY)
  } catch (err) {
    console.warn('HabitSphere: could not reset state.', err)
  }
  return buildFreshState()
}

export function exportState(state) {
  const blob = new Blob([JSON.stringify(state, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `habitsphere-backup-${new Date().toISOString().slice(0, 10)}.json`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

// Fill in any missing keys so older/partial states never crash the app.
function migrate(state) {
  const fresh = buildFreshState()
  const merged = {
    ...fresh,
    ...state,
    version: STATE_VERSION,
    user: { ...fresh.user, ...(state.user || {}) },
    settings: { ...fresh.settings, ...(state.settings || {}) },
  }
  merged.habits = Array.isArray(state.habits) ? state.habits : []
  merged.moods = state.moods || {}
  merged.water = state.water || {}
  merged.journal = state.journal || {}
  merged.focus = state.focus || {}
  merged.achievements = state.achievements || {}
  merged.waterGoal = state.waterGoal || fresh.waterGoal
  merged.focusTotal = state.focusTotal || 0
  return merged
}
