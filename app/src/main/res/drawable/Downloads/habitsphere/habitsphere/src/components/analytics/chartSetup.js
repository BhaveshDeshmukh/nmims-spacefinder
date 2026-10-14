import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Tooltip,
  Filler,
  ArcElement,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Filler
)

ChartJS.defaults.color = '#A1A1AA'
ChartJS.defaults.font.family =
  "Inter, ui-sans-serif, system-ui, sans-serif"
ChartJS.defaults.borderColor = 'rgba(255,255,255,0.06)'

export const baseOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: { display: false },
    tooltip: {
      backgroundColor: 'rgba(17,24,39,0.95)',
      borderColor: 'rgba(168,85,247,0.4)',
      borderWidth: 1,
      padding: 10,
      cornerRadius: 10,
      titleColor: '#F8FAFC',
      bodyColor: '#A1A1AA',
    },
  },
  scales: {
    x: { grid: { display: false }, ticks: { color: '#A1A1AA' } },
    y: { grid: { color: 'rgba(255,255,255,0.05)' }, ticks: { color: '#A1A1AA' }, beginAtZero: true },
  },
}

export function purpleGradient(ctx, area) {
  if (!area) return 'rgba(168,85,247,0.4)'
  const g = ctx.createLinearGradient(0, area.top, 0, area.bottom)
  g.addColorStop(0, 'rgba(168,85,247,0.55)')
  g.addColorStop(1, 'rgba(124,58,237,0.02)')
  return g
}
