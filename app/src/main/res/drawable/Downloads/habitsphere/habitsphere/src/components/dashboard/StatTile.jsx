import Icon from '../ui/Icon.jsx'

export default function StatTile({ icon, label, value, sub, accent = '#A855F7' }) {
  return (
    <div className="surface rounded-xl2 p-4">
      <div className="flex items-center justify-between">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-xl2"
          style={{ background: `${accent}22`, color: accent }}
        >
          <Icon name={icon} size={18} />
        </span>
        {sub && <span className="text-xs text-muted">{sub}</span>}
      </div>
      <p className="mt-3 font-display text-2xl font-bold text-ink leading-none">{value}</p>
      <p className="mt-1 text-sm text-muted">{label}</p>
    </div>
  )
}
