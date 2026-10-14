import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { useApp } from './context/AppContext.jsx'
import AppShell from './components/layout/AppShell.jsx'
import Toasts from './components/ui/Toasts.jsx'

import Landing from './pages/Landing/Landing.jsx'
import Onboarding from './pages/Onboarding/Onboarding.jsx'
import Dashboard from './pages/Dashboard/Dashboard.jsx'
import Habits from './pages/Habits/Habits.jsx'
import Garden from './pages/Garden/Garden.jsx'
import Focus from './pages/Focus/Focus.jsx'
import Journal from './pages/Journal/Journal.jsx'
import Analytics from './pages/Analytics/Analytics.jsx'
import Profile from './pages/Profile/Profile.jsx'
import Settings from './pages/Settings/Settings.jsx'

function RequireOnboarded({ children }) {
  const { state } = useApp()
  const loc = useLocation()
  if (!state.user?.onboarded) {
    return <Navigate to="/onboarding" replace state={{ from: loc.pathname }} />
  }
  return children
}

export default function App() {
  return (
    <>
      <Toasts />
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route
          element={
            <RequireOnboarded>
              <AppShell />
            </RequireOnboarded>
          }
        >
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/habits" element={<Habits />} />
          <Route path="/garden" element={<Garden />} />
          <Route path="/focus" element={<Focus />} />
          <Route path="/journal" element={<Journal />} />
          <Route path="/analytics" element={<Analytics />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/settings" element={<Settings />} />
        </Route>
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}
