import { motion } from 'framer-motion'

// Standard surface panel used across pages. Avoids nesting cards excessively.
export function Panel({ children, className = '', as = 'section', ...rest }) {
  const Cmp = motion[as] || motion.section
  return (
    <Cmp
      className={`surface rounded-xl3 p-5 md:p-6 shadow-soft ${className}`}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      {...rest}
    >
      {children}
    </Cmp>
  )
}

export function SectionHeader({ title, subtitle, icon, action }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-3">
      <div className="flex items-center gap-2.5">
        {icon}
        <div>
          <h2 className="font-display text-lg font-semibold text-ink leading-tight">{title}</h2>
          {subtitle && <p className="text-sm text-muted mt-0.5">{subtitle}</p>}
        </div>
      </div>
      {action}
    </div>
  )
}

export function PageHeader({ title, subtitle, right }) {
  return (
    <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h1 className="font-display text-2xl md:text-3xl font-bold text-gradient">{title}</h1>
        {subtitle && <p className="text-muted mt-1">{subtitle}</p>}
      </div>
      {right}
    </div>
  )
}
