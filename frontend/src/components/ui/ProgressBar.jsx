import { cn } from '../../utils/cn'

export function ProgressBar({
  percentage = 0,
  submitted = 0,
  total = 0,
  showLabel = true,
  className = '',
}) {
  const safePercentage = Math.min(100, Math.max(0, percentage))

  return (
    <div className={cn('w-full space-y-1.5', className)}>
      {showLabel && (
        <div className="flex items-center justify-between text-xs font-semibold text-slate-600">
          <span className="text-slate-500">
            {submitted} of {total} submitted
          </span>
          <span className="tabular-nums font-bold text-slate-800">{safePercentage}%</span>
        </div>
      )}
      <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100/90 border border-slate-200/60 p-0.5">
        <div
          className={cn(
            'h-full transition-all duration-500 ease-out rounded-full',
            safePercentage >= 100
              ? 'bg-emerald-500'
              : safePercentage >= 50
              ? 'bg-indigo-600'
              : safePercentage > 0
              ? 'bg-amber-500'
              : 'bg-slate-300'
          )}
          style={{ width: `${safePercentage}%` }}
        />
      </div>
    </div>
  )
}
