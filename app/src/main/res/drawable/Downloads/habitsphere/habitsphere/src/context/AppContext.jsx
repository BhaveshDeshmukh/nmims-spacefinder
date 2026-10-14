import { createContext, useContext, useEffect, useMemo, useRef, useState, useCallback } from 'react'
import { loadState, saveState as persist, resetState as wipe, exportState as doExport } from '../utils/storage.js'
import {
  buildDemoState,
  buildFreshState,
  makeId,
  XP,
  DEFAULT_WATER_GOAL,
} from '../data/defaults.js'
import { todayKey } from '../utils/date.js'
import { levelFromXp, computeStreak, completionForDay } from '../utils/gamification.js'
import { novaState } from '../utils/nova.js'
import { evaluateAchievements } from '../utils/achievements.js'
import { ACHIEVEMENTS } from '../data/defaults.js'

const AppContext = createContext(null)
export const useApp = () => useContext(AppContext)

function ensureShape(s) {
  return {
    bonusDays: {},
    streakAwards: {},
    ...s,
  }
}

export function AppProvider({ children }) {
  const [state, setState] = useState(() => {
    const loaded = loadState()
    return ensureShape(loaded || buildFreshState())
  })
  const [toasts, setToasts] = useState([])
  const [flash, setFlash] = useState({})
  const stateRef = useRef(state)
  stateRef.current = state

  // Persist on every change.
  useEffect(() => {
    persist(state)
  }, [state])

  // Apply reduced-motion / dark class to the document.
  useEffect(() => {
    const root = document.documentElement
    if (state.settings?.reducedMotion) root.classList.add('reduce-motion')
    else root.classList.remove('reduce-motion')
  }, [state.settings?.reducedMotion])

  const pushToast = useCallback((toast) => {
    const id = makeId('t')
    setToasts((prev) => [...prev, { id, ...toast }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, toast.duration || 3200)
  }, [])

  const dismissToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const flashNova = useCallback((ctx) => {
    setFlash(ctx)
    setTimeout(() => setFlash({}), 5000)
  }, [])

  // Central commit: sets state, awards XP delta, detects level-up & achievements.
  const commit = useCallback(
    (next, { xp = 0, toast, novaCtx } = {}) => {
      const prev = stateRef.current
      const prevXp = prev.user?.xp || 0
      const newXp = Math.max(0, prevXp + xp)
      const merged = { ...next, user: { ...next.user, xp: newXp } }

      // Achievements
      const before = prev.achievements || {}
      const nowUnlocked = evaluateAchievements(merged)
      const newlyIds = Object.keys(nowUnlocked).filter((id) => !before[id])
      merged.achievements = { ...before, ...nowUnlocked }

      setState(ensureShape(merged))

      if (xp > 0) pushToast({ type: 'xp', title: `+${xp} XP`, sub: toast })
      else if (toast) pushToast({ type: 'info', title: toast })

      // Level-up detection
      const beforeLvl = levelFromXp(prevXp).level
      const afterLvl = levelFromXp(newXp).level
      if (afterLvl > beforeLvl) {
        pushToast({ type: 'level', title: `Level ${afterLvl}!`, sub: levelFromXp(newXp).title, duration: 4200 })
      }

      // Newly-unlocked achievement toasts
      newlyIds.forEach((id) => {
        const a = ACHIEVEMENTS.find((x) => x.id === id)
        if (a) pushToast({ type: 'achievement', title: a.name, sub: 'Achievement unlocked', duration: 4200 })
      })

      if (novaCtx) flashNova(novaCtx)
    },
    [pushToast, flashNova]
  )

  // ---------------------- ACTIONS ----------------------
  const completeOnboarding = useCallback((name, goal, starterHabits) => {
    const base = buildFreshState({ name, goal })
    base.user.onboarded = true
    base.habits = (starterHabits || []).map((h) => ({
      id: makeId(),
      name: h.name,
      icon: h.icon,
      category: h.category,
      frequency: 'daily',
      reminder: h.reminder || '09:00',
      createdAt: todayKey(),
      completedDates: [],
    }))
    commit(ensureShape(base), { toast: 'Welcome to HabitSphere 🌱' })
  }, [commit])

  const loadDemo = useCallback((name) => {
    const demo = buildDemoState({ name: name || stateRef.current.user?.name })
    demo.user.onboarded = true
    // Evaluate achievements from the seeded history so the demo reflects real earned badges.
    demo.achievements = evaluateAchievements(demo)
    setState(ensureShape(demo))
    pushToast({ type: 'info', title: 'Demo data loaded' })
  }, [pushToast])

  const toggleHabit = useCallback((id, dayKey = todayKey()) => {
    const prev = stateRef.current
    let becameComplete = false
    const habits = prev.habits.map((h) => {
      if (h.id !== id) return h
      const set = new Set(h.completedDates || [])
      if (set.has(dayKey)) set.delete(dayKey)
      else { set.add(dayKey); becameComplete = true }
      return { ...h, completedDates: Array.from(set).sort() }
    })

    let xp = becameComplete ? XP.COMPLETE_HABIT : -XP.COMPLETE_HABIT
    const next = { ...prev, habits }

    // All-habits-today bonus (idempotent per day)
    const bonusDays = { ...(prev.bonusDays || {}) }
    const dayNow = completionForDay(habits, dayKey)
    const allDone = dayNow.total > 0 && dayNow.done === dayNow.total
    let novaCtx = { justCompleted: becameComplete }
    if (allDone && !bonusDays[dayKey]) { xp += XP.ALL_HABITS_BONUS; bonusDays[dayKey] = true }
    else if (!allDone && bonusDays[dayKey]) { xp -= XP.ALL_HABITS_BONUS; delete bonusDays[dayKey] }
    next.bonusDays = bonusDays

    // Streak milestone bonus (every 7 days, once each)
    const streakAwards = { ...(prev.streakAwards || {}) }
    const streak = computeStreak(habits)
    const milestone = Math.floor(streak / 7) * 7
    if (becameComplete && milestone >= 7 && !streakAwards[milestone]) {
      xp += XP.STREAK_7
      streakAwards[milestone] = true
      novaCtx = { justCelebrated: true }
    }
    next.streakAwards = streakAwards

    const toast = becameComplete
      ? (allDone ? 'All habits complete today!' : 'Habit complete')
      : undefined
    commit(next, { xp, toast, novaCtx })
  }, [commit])

  const addHabit = useCallback((data) => {
    const prev = stateRef.current
    const habit = {
      id: makeId(),
      name: data.name?.trim() || 'New Habit',
      icon: data.icon || 'Target',
      category: data.category || 'Health',
      frequency: data.frequency || 'daily',
      reminder: data.reminder || '09:00',
      createdAt: todayKey(),
      completedDates: [],
    }
    commit({ ...prev, habits: [...prev.habits, habit] }, { toast: 'Habit added' })
  }, [commit])

  const editHabit = useCallback((id, data) => {
    const prev = stateRef.current
    const habits = prev.habits.map((h) => (h.id === id ? { ...h, ...data } : h))
    commit({ ...prev, habits }, { toast: 'Habit updated' })
  }, [commit])

  const deleteHabit = useCallback((id) => {
    const prev = stateRef.current
    commit({ ...prev, habits: prev.habits.filter((h) => h.id !== id) }, { toast: 'Habit removed' })
  }, [commit])

  const addWater = useCallback((ml) => {
    const prev = stateRef.current
    const t = todayKey()
    const water = { ...prev.water }
    const before = water[t] || 0
    water[t] = Math.max(0, before + ml)
    let xp = 0
    let toast
    const goal = prev.waterGoal || DEFAULT_WATER_GOAL
    if (before < goal && water[t] >= goal) { xp = XP.WATER_GOAL; toast = 'Water goal reached! 💧' }
    commit({ ...prev, water }, { xp, toast })
  }, [commit])

  const setWaterGoal = useCallback((goal) => {
    const prev = stateRef.current
    commit({ ...prev, waterGoal: goal })
  }, [commit])

  const setMood = useCallback((moodId) => {
    const prev = stateRef.current
    const t = todayKey()
    const already = (prev.moods || {})[t]
    const moods = { ...prev.moods, [t]: moodId }
    const xp = already ? 0 : XP.LOG_MOOD
    commit({ ...prev, moods }, { xp, toast: already ? undefined : 'Mood logged', novaCtx: {} })
  }, [commit])

  const saveJournal = useCallback((dayKey, entry) => {
    const prev = stateRef.current
    const existed = !!(prev.journal || {})[dayKey]
    const journal = { ...prev.journal, [dayKey]: { ...entry, updatedAt: new Date().toISOString() } }
    const xp = existed ? 0 : XP.JOURNAL_ENTRY
    commit({ ...prev, journal }, { xp, toast: existed ? 'Journal saved' : 'Journal entry saved' })
  }, [commit])

  const addFocusSession = useCallback(() => {
    const prev = stateRef.current
    const t = todayKey()
    const focus = { ...prev.focus, [t]: ((prev.focus || {})[t] || 0) + 1 }
    const focusTotal = (prev.focusTotal || 0) + 1
    commit({ ...prev, focus, focusTotal }, { xp: XP.FOCUS_SESSION, toast: 'Focus session complete 🎯' })
  }, [commit])

  const updateSettings = useCallback((patch) => {
    const prev = stateRef.current
    commit({ ...prev, settings: { ...prev.settings, ...patch } })
  }, [commit])

  const setName = useCallback((name) => {
    const prev = stateRef.current
    commit({ ...prev, user: { ...prev.user, name: name?.trim() || prev.user.name } }, { toast: 'Profile updated' })
  }, [commit])

  const setGoal = useCallback((goal) => {
    const prev = stateRef.current
    commit({ ...prev, user: { ...prev.user, goal } })
  }, [commit])

  const dismissRecovery = useCallback(() => {
    const prev = stateRef.current
    commit({ ...prev, recoveryDismissed: todayKey() })
  }, [commit])

  const resetAll = useCallback(() => {
    const fresh = ensureShape(wipe())
    setState(fresh)
    pushToast({ type: 'info', title: 'All data reset' })
  }, [pushToast])

  const exportData = useCallback(() => {
    doExport(stateRef.current)
    pushToast({ type: 'info', title: 'Backup exported' })
  }, [pushToast])

  // Derived values
  const level = useMemo(() => levelFromXp(state.user?.xp || 0), [state.user?.xp])
  const streak = useMemo(() => computeStreak(state.habits || []), [state.habits])
  const nova = useMemo(() => novaState(state, flash), [state, flash])

  const value = {
    state,
    setState,
    toasts,
    dismissToast,
    level,
    streak,
    nova,
    // actions
    completeOnboarding,
    loadDemo,
    toggleHabit,
    addHabit,
    editHabit,
    deleteHabit,
    addWater,
    setWaterGoal,
    setMood,
    saveJournal,
    addFocusSession,
    updateSettings,
    setName,
    setGoal,
    dismissRecovery,
    resetAll,
    exportData,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}
