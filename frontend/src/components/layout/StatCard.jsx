import { cn } from '../../utils/cn'

export function StatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
  className = '',
}) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-5 shadow-2xs transition-all duration-200 hover:shadow-sm hover:border-slate-300',
        className
      )}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        {Icon && (
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-50/80 border border-indigo-100 text-indigo-600 shadow-3xs">
            <Icon className="h-5 w-5" />
          </div>
        )}
      </div>
      <div className="mt-3 flex items-baseline gap-2">
        <span className="text-3xl font-extrabold tracking-tight text-slate-900 tabular-nums">
          {value}
        </span>
        {trend && (
          <span className="text-xs font-semibold text-emerald-600">{trend}</span>
        )}
      </div>
      {subtitle && (
        <p className="mt-1 text-xs text-slate-500 font-medium">{subtitle}</p>
      )}
    </div>
  )
}
