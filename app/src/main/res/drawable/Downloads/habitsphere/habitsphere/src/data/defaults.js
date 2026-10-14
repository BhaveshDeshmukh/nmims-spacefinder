import { keyFromOffset, todayKey } from '../utils/date.js'

export const STORAGE_KEY = 'habitsphere_state'
export const STATE_VERSION = 1

export const WATER_STEP_ML = 250
export const DEFAULT_WATER_GOAL = 3000

export const GOALS = [
  { id: 'fitness', label: 'Fitness', icon: 'Dumbbell', blurb: 'Move more, feel stronger' },
  { id: 'study', label: 'Study', icon: 'BookOpen', blurb: 'Learn with consistency' },
  { id: 'productivity', label: 'Productivity', icon: 'Rocket', blurb: 'Get meaningful work done' },
  { id: 'wellness', label: 'Mental Wellness', icon: 'HeartPulse', blurb: 'Calmer, more balanced days' },
  { id: 'routine', label: 'Better Routine', icon: 'Sunrise', blurb: 'Build a rhythm that sticks' },
]

// Catalog of starter habits offered during onboarding.
export const STARTER_HABITS = [
  { name: 'Drink Water', icon: 'Droplets', category: 'Health', reminder: '09:00' },
  { name: 'Exercise', icon: 'Dumbbell', category: 'Fitness', reminder: '07:00' },
  { name: 'Read', icon: 'BookOpen', category: 'Learning', reminder: '21:00' },
  { name: 'Meditate', icon: 'Brain', category: 'Wellness', reminder: '08:00' },
  { name: 'Study', icon: 'GraduationCap', category: 'Learning', reminder: '19:00' },
  { name: 'Sleep Early', icon: 'Moon', category: 'Wellness', reminder: '22:30' },
  { name: 'Walk', icon: 'Footprints', category: 'Fitness', reminder: '18:00' },
  { name: 'Journal', icon: 'PenLine', category: 'Wellness', reminder: '21:30' },
]

export const HABIT_CATEGORIES = [
  'Health',
  'Fitness',
  'Learning',
  'Wellness',
  'Productivity',
  'Mind',
]

export const HABIT_ICON_CHOICES = [
  'Droplets', 'Dumbbell', 'BookOpen', 'Brain', 'GraduationCap', 'Moon',
  'Footprints', 'PenLine', 'Coffee', 'Apple', 'Music', 'Sun',
  'Heart', 'Target', 'Sparkles', 'Bike', 'Leaf', 'Code',
]

export const MOODS = [
  { id: 'excellent', label: 'Excellent', score: 5, color: '#22C55E', emoji: '🤩' },
  { id: 'good', label: 'Good', score: 4, color: '#A855F7', emoji: '🙂' },
  { id: 'okay', label: 'Okay', score: 3, color: '#F59E0B', emoji: '😐' },
  { id: 'low', label: 'Low', score: 2, color: '#60A5FA', emoji: '😔' },
  { id: 'stressed', label: 'Stressed', score: 1, color: '#EF4444', emoji: '😣' },
]

// XP thresholds — the cumulative XP required to *reach* each level.
export const LEVELS = [
  { level: 1, xp: 0, title: 'Seedling' },
  { level: 2, xp: 250, title: 'Sprout' },
  { level: 3, xp: 600, title: 'Grower' },
  { level: 4, xp: 1000, title: 'Bloomer' },
  { level: 5, xp: 1600, title: 'Flourisher' },
  { level: 6, xp: 2400, title: 'Cultivator' },
  { level: 7, xp: 3400, title: 'Luminary' },
  { level: 8, xp: 5000, title: 'Habit Master' },
]

export const XP = {
  COMPLETE_HABIT: 20,
  ALL_HABITS_BONUS: 50,
  STREAK_7: 100,
  LOG_MOOD: 10,
  FOCUS_SESSION: 25,
  JOURNAL_ENTRY: 15,
  WATER_GOAL: 20,
}

export const ACHIEVEMENTS = [
  { id: 'first_step', name: 'First Step', desc: 'Complete your first habit.', icon: 'Footprints' },
  { id: 'flame_7', name: '7 Day Flame', desc: 'Maintain a 7-day streak.', icon: 'Flame' },
  { id: 'hydration_hero', name: 'Hydration Hero', desc: 'Reach your water goal 7 times.', icon: 'Droplets' },
  { id: 'focus_master', name: 'Focus Master', desc: 'Complete 20 focus sessions.', icon: 'Timer' },
  { id: 'journal_keeper', name: 'Journal Keeper', desc: 'Write 7 journal entries.', icon: 'BookMarked' },
  { id: 'garden_bloom', name: 'Garden Bloom', desc: 'Reach 80% garden growth.', icon: 'Flower2' },
  { id: 'mood_mindful', name: 'Mindful', desc: 'Log your mood 5 days.', icon: 'Smile' },
  { id: 'level_5', name: 'Rising Star', desc: 'Reach Level 5.', icon: 'Star' },
]

export const QUOTES = [
  { t: 'Small steps every day add up to big changes.', a: 'HabitSphere' },
  { t: 'You do not rise to the level of your goals. You fall to the level of your systems.', a: 'James Clear' },
  { t: 'Discipline is choosing between what you want now and what you want most.', a: 'Abraham Lincoln' },
  { t: 'Motivation gets you going. Habit keeps you growing.', a: 'John C. Maxwell' },
  { t: 'The secret of getting ahead is getting started.', a: 'Mark Twain' },
  { t: 'A river cuts through rock not because of its power, but its persistence.', a: 'James N. Watkins' },
  { t: 'Well done is better than well said.', a: 'Benjamin Franklin' },
  { t: 'Water the garden you want to grow.', a: 'Nova' },
]

export function pickQuote(seed = new Date().getDate()) {
  return QUOTES[seed % QUOTES.length]
}

let idCounter = 0
export function makeId(prefix = 'h') {
  idCounter += 1
  return `${prefix}_${Date.now().toString(36)}_${idCounter.toString(36)}`
}

function habit(name, icon, category, reminder, historyDays = []) {
  const created = keyFromOffset(-13)
  const completedDates = historyDays.map((o) => keyFromOffset(o))
  return {
    id: makeId(),
    name,
    icon,
    category,
    frequency: 'daily',
    reminder,
    createdAt: created,
    completedDates,
  }
}

// Realistic-but-fabricated demo data so the app "feels alive" on first load.
// User actions mutate this exact same shape, so nothing here is a fake stat.
export function buildDemoState(user) {
  const t = todayKey()
  const water = {}
  const moods = {}
  const focus = {}
  const moodCycle = ['good', 'excellent', 'okay', 'good', 'low', 'good', 'excellent', 'okay', 'good', 'good', 'excellent', 'okay', 'good']
  for (let i = 13; i >= 1; i--) {
    const k = keyFromOffset(-i)
    water[k] = 1500 + ((i * 313) % 1600) // varied intake history
    moods[k] = moodCycle[(13 - i) % moodCycle.length]
    focus[k] = (i % 3 === 0) ? 2 : (i % 2 === 0 ? 1 : 0)
  }
  water[t] = 750

  return {
    version: STATE_VERSION,
    createdAt: new Date().toISOString(),
    user: {
      name: user?.name || 'Chirag',
      goal: user?.goal || 'wellness',
      xp: 420,
      onboarded: true,
    },
    habits: [
      habit('Drink Water', 'Droplets', 'Health', '09:00', [-12, -11, -10, -9, -8, -7, -5, -4, -3, -2, -1]),
      habit('Read', 'BookOpen', 'Learning', '21:00', [-13, -12, -11, -9, -8, -6, -5, -4, -2, -1]),
      habit('Exercise', 'Dumbbell', 'Fitness', '07:00', [-12, -10, -9, -7, -5, -3, -2, -1]),
      habit('Meditate', 'Brain', 'Wellness', '08:00', [-11, -9, -8, -6, -4, -3, -1]),
    ],
    moods,
    water,
    waterGoal: DEFAULT_WATER_GOAL,
    journal: {},
    focus,
    focusTotal: 24,
    achievements: {},
    recoveryDismissed: null,
    settings: {
      reducedMotion: false,
      darkMode: true,
    },
  }
}

export function buildFreshState(user) {
  return {
    version: STATE_VERSION,
    createdAt: new Date().toISOString(),
    user: {
      name: user?.name || 'Friend',
      goal: user?.goal || 'routine',
      xp: 0,
      onboarded: false,
    },
    habits: [],
    moods: {},
    water: {},
    waterGoal: DEFAULT_WATER_GOAL,
    journal: {},
    focus: {},
    focusTotal: 0,
    achievements: {},
    recoveryDismissed: null,
    settings: { reducedMotion: false, darkMode: true },
  }
}
