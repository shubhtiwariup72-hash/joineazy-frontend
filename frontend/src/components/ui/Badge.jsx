import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-indigo-50/90 text-indigo-700 border-indigo-200/80',
  success: 'bg-emerald-50/90 text-emerald-700 border-emerald-200/80',
  warning: 'bg-amber-50/90 text-amber-700 border-amber-200/80',
  danger: 'bg-rose-50/90 text-rose-700 border-rose-200/80',
  neutral: 'bg-slate-100/90 text-slate-700 border-slate-200/80',
  purple: 'bg-purple-50/90 text-purple-700 border-purple-200/80',
}

const SIZES = {
  sm: 'px-2 py-0.5 text-xs font-semibold',
  md: 'px-2.5 py-1 text-xs font-semibold',
  lg: 'px-3 py-1.5 text-sm font-semibold',
}

export function Badge({
  children,
  variant = 'neutral',
  size = 'sm',
  className = '',
  icon: Icon,
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-semibold select-none shadow-3xs',
        VARIANTS[variant] || VARIANTS.neutral,
        SIZES[size] || SIZES.sm,
        className
      )}
    >
      {Icon && <Icon className="h-3.5 w-3.5 shrink-0" />}
      {children}
    </span>
  )
}
