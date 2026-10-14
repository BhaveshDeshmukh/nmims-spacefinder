import { motion } from 'framer-motion'

const variants = {
  primary:
    'bg-primary hover:bg-accent text-white shadow-glow border border-accent/40',
  ghost: 'bg-white/5 hover:bg-white/10 text-ink border border-line',
  subtle: 'bg-transparent hover:bg-white/5 text-muted hover:text-ink',
  danger: 'bg-danger/90 hover:bg-danger text-white border border-danger/40',
  success: 'bg-success/90 hover:bg-success text-white border border-success/40',
}

export default function Button({
  children,
  variant = 'primary',
  className = '',
  as,
  ...rest
}) {
  const cls = `inline-flex items-center justify-center gap-2 rounded-xl2 px-4 py-2.5 text-sm font-semibold transition-colors focus-visible:outline-none disabled:opacity-50 disabled:pointer-events-none ${variants[variant]} ${className}`
  const Cmp = as ? motion[as] : motion.button
  return (
    <Cmp whileTap={{ scale: 0.96 }} className={cls} {...rest}>
      {children}
    </Cmp>
  )
}
