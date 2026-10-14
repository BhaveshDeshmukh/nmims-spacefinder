// Primary navigation definition shared by the sidebar and bottom nav.
export const NAV = [
  { to: '/dashboard', label: 'Dashboard', icon: 'LayoutDashboard' },
  { to: '/habits', label: 'Habits', icon: 'ListChecks' },
  { to: '/garden', label: 'Garden', icon: 'Flower2' },
  { to: '/focus', label: 'Focus', icon: 'Timer' },
  { to: '/analytics', label: 'Analytics', icon: 'BarChart3' },
]

export const SECONDARY = [
  { to: '/journal', label: 'Journal', icon: 'PenLine' },
  { to: '/profile', label: 'Profile', icon: 'User' },
  { to: '/settings', label: 'Settings', icon: 'Settings' },
]

// Bottom (mobile) nav keeps 5 core destinations.
export const BOTTOM = NAV
