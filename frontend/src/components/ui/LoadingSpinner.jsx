import { cn } from '../../utils/cn'

export function LoadingSpinner({
  size = 'md',
  message = 'Loading...',
  className = '',
}) {
  const sizeClasses = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-3',
    lg: 'h-12 w-12 border-4',
  }

  return (
    <div
      className={cn(
        'flex flex-col items-center justify-center p-8 space-y-3',
        className
      )}
    >
      <div
        className={cn(
          'animate-spin rounded-full border-slate-200 border-t-indigo-600',
          sizeClasses[size] || sizeClasses.md
        )}
      />
      {message && <p className="text-sm font-medium text-slate-500">{message}</p>}
    </div>
  )
}

