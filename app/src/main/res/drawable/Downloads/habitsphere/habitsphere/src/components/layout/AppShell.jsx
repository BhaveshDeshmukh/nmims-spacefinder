import { Outlet, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import Sidebar from './Sidebar.jsx'
import BottomNav from './BottomNav.jsx'
import MobileTopBar from './MobileTopBar.jsx'

export default function AppShell() {
  const loc = useLocation()
  return (
    <div className="relative min-h-screen">
      <div className="app-aurora" />
      <Sidebar />
      <MobileTopBar />
      <main className="relative z-10 lg:pl-64">
        <div className="mx-auto w-full max-w-6xl px-4 pb-28 pt-5 sm:px-6 lg:px-8 lg:pt-8 lg:pb-12">
          <AnimatePresence mode="wait">
            <motion.div
              key={loc.pathname}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </div>
      </main>
      <BottomNav />
    </div>
  )
}
