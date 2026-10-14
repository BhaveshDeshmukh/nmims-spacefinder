# HabitSphere 🟣

### One dashboard. Better habits. Better life.

A futuristic personal-growth companion built for **PixxelHack 2.0** — a Mental Wellness & Habit Tracker that goes far beyond a checklist. Track habits, mood, hydration, focus and journaling in one place; watch your consistency grow a living **Habit Garden**; and get gentle, intelligent nudges from **Nova**, your rule-based companion.

Frontend-only. No backend. All data lives in your browser via LocalStorage.

---

## ✨ Features

- **Growth Score** — a real 0–100 score computed from your actual daily activity (habits, water, focus, mood, journal).
- **Habit CRUD** — add, edit, delete, complete/uncomplete, categories, frequency, reminder times, per-habit streaks.
- **XP & Levels** — completing habits earns XP; level up through 8 tiers with milestone bonuses.
- **Nova companion** — reacts to your real state with 7 moods (idle, happy, excited, encouraging, sleeping, celebrating, concerned). Local & rule-based — no fake AI claims.
- **Habit Garden** — a procedural SVG garden (seed → sprout → plant → tree → blooming garden) that grows with your consistency.
- **Habit DNA** — behavioural insights derived only from your stored data ("You complete more habits on weekdays"). Locked until you have 7 days of data.
- **Recovery Mode** — after several low days, offers 2–3 small achievable actions instead of overwhelming you.
- **Water tracker** — animated glass fill, +250 / +500 ml, configurable goal.
- **Mood tracker** — five moods with a 7-day trend.
- **Daily Journal** — reflection, wins, improvements, tomorrow's intention; saved by date.
- **Focus Mode** — functional Pomodoro (25/5) with session tracking.
- **Analytics** — Chart.js visualizations for completion, water and mood, plus a **Weekly Story** recap (mini "Wrapped").
- **Achievements** — real unlock conditions with locked/unlocked states and progress.
- **Fully responsive** — desktop sidebar, mobile bottom nav; tested at 1440 / 1024 / 768 / 390 px with no horizontal overflow.
- **Accessible** — semantic HTML, aria-labels, keyboard-friendly, visible focus states, reduced-motion support.

## 🛠 Tech Stack

React · Vite · JavaScript · Tailwind CSS · Framer Motion · React Router · Lucide React · Chart.js / react-chartjs-2 · LocalStorage

## 🚀 Getting started

```bash
npm install
npm run dev      # http://localhost:5173
```

## 📦 Build

```bash
npm run build    # outputs to /dist
npm run preview  # preview the production build
```

## 🌐 Deploy

The app is a static SPA and works on any static host.

- **Netlify** — drag-and-drop the `dist` folder, or connect the repo (build: `npm run build`, publish: `dist`). SPA routing handled by `netlify.toml` / `public/_redirects`.
- **Vercel** — import the repo; `vercel.json` handles SPA rewrites.
- Because `vite.config.js` sets `base: './'`, the built assets also work from a sub-path.

> Routing uses `BrowserRouter`. The included `_redirects`, `netlify.toml` and `vercel.json` provide the SPA fallback so deep links (e.g. `/dashboard`) work on refresh.

## 🗂 Architecture

```
src/
  components/   layout · ui · dashboard · habits · garden · nova · analytics · water · mood
  pages/        Landing · Onboarding · Dashboard · Habits · Garden · Focus · Journal · Analytics · Profile · Settings
  context/      AppContext.jsx — single source of truth + all actions
  utils/        storage · date · gamification · nova · insights · achievements
  data/         defaults.js — config, demo data, levels, achievements, quotes
```

State is centralized in `AppContext` and persisted under a single versioned key `habitsphere_state`. Storage access is crash-safe with sensible defaults and migration, so an empty or malformed store never breaks the app. Utility functions: `loadState`, `saveState`, `resetState`, `exportState`.

## 🔒 Privacy

Everything stays on your device. Export a JSON backup or reset all data anytime from **Settings**.

---

Built with 💜 for PixxelHack 2.0.
