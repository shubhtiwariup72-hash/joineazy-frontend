import { cn } from '../../utils/cn'

export function Card({ children, className = '', hover = false, ...props }) {
  return (
    <div
      className={cn(
        'rounded-2xl border border-slate-200/80 bg-white p-4 sm:p-6 shadow-2xs transition-all duration-200',
        hover && 'hover:shadow-md hover:border-slate-300 hover:-translate-y-0.5',
        className
      )}
      {...props}
    >
      {children}
    </div>
  )
}

export function CardHeader({ children, className = '' }) {
  return <div className={cn('flex flex-col space-y-1.5 pb-4', className)}>{children}</div>
}

export function CardTitle({ children, className = '' }) {
  return (
    <h3 className={cn('text-lg font-bold text-slate-900 tracking-tight leading-snug', className)}>
      {children}
    </h3>
  )
}

export function CardDescription({ children, className = '' }) {
  return <p className={cn('text-sm text-slate-500 leading-relaxed', className)}>{children}</p>
}

export function CardContent({ children, className = '' }) {
  return <div className={cn('space-y-4', className)}>{children}</div>
}

export function CardFooter({ children, className = '' }) {
  return (
    <div className={cn('flex items-center justify-between pt-4 border-t border-slate-100/90', className)}>
      {children}
    </div>
  )
}
