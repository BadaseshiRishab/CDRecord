import { cn } from '../../lib/utils'

const VARIANTS = {
  default: 'border-primary/30 bg-primary/15 text-primary',
  success: 'border-emerald-400/30 bg-emerald-500/15 text-emerald-300',
  destructive: 'border-rose-400/30 bg-rose-500/15 text-rose-300',
  muted: 'border-border bg-muted text-muted-foreground',
}

export function Badge({ className, variant = 'default', ...props }) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-[0.08em] whitespace-nowrap shadow-sm',
        VARIANTS[variant] ?? VARIANTS.default,
        className
      )}
      {...props}
    />
  )
}
