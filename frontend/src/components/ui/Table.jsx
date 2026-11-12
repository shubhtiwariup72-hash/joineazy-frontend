import { cn } from '../../utils/cn'

export function Table({ children, className = '' }) {
  return (
    <div className="w-full overflow-x-auto rounded-xl border border-slate-200 bg-white shadow-xs">
      <table className={cn('w-full text-left text-sm text-slate-600', className)}>
        {children}
      </table>
    </div>
  )
}

export function TableHeader({ children, className = '' }) {
  return (
    <thead
      className={cn(
        'border-b border-slate-200 bg-slate-50/80 text-xs font-semibold uppercase tracking-wider text-slate-600',
        className
      )}
    >
      {children}
    </thead>
  )
}

export function TableBody({ children, className = '' }) {
  return <tbody className={cn('divide-y divide-slate-100', className)}>{children}</tbody>
}

export function TableRow({ children, className = '' }) {
  return (
    <tr className={cn('transition-colors hover:bg-slate-50/60', className)}>
      {children}
    </tr>
  )
}

export function TableHead({ children, className = '' }) {
  return <th className={cn('px-4 py-3 font-semibold text-slate-700', className)}>{children}</th>
}

export function TableCell({ children, className = '' }) {
  return <td className={cn('px-4 py-3.5 align-middle', className)}>{children}</td>
}

