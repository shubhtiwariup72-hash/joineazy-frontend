import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Textarea = forwardRef(function Textarea(
  {
    label,
    error,
    helperText,
    id,
    rows = 3,
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const textareaId = id || props.name

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={textareaId}
          className="block text-xs font-semibold text-slate-700 tracking-wide"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}
      <textarea
        ref={ref}
        id={textareaId}
        rows={rows}
        className={cn(
          'w-full rounded-xl border bg-white px-3.5 py-2.5 text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-150',
          'hover:border-slate-300 focus:outline-none focus:ring-3 focus:ring-indigo-500/15 focus:border-indigo-600',
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15 text-rose-900'
            : 'border-slate-200/90',
          props.disabled && 'bg-slate-50/80 text-slate-400 cursor-not-allowed hover:border-slate-200/90',
          className
        )}
        {...props}
      />
      {error ? (
        <p className="text-xs text-rose-600 font-medium pl-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 pl-0.5">{helperText}</p>
      ) : null}
    </div>
  )
})
