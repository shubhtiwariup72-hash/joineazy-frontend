import { forwardRef } from 'react'
import { cn } from '../../utils/cn'

export const Input = forwardRef(function Input(
  {
    label,
    error,
    helperText,
    icon: Icon,
    id,
    type = 'text',
    className = '',
    required = false,
    ...props
  },
  ref
) {
  const inputId = id || props.name

  return (
    <div className="w-full space-y-1.5 text-left">
      {label && (
        <label
          htmlFor={inputId}
          className="block text-xs font-semibold text-slate-700 tracking-wide"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && (
          <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3.5 text-slate-400">
            <Icon className="h-4 w-4" />
          </div>
        )}
        <input
          ref={ref}
          id={inputId}
          type={type}
          className={cn(
            'min-h-[44px] h-11 w-full rounded-xl border bg-white px-3.5 py-2 text-base sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-2xs transition-all duration-150',
            'hover:border-slate-300 focus:outline-none focus:ring-3 focus:ring-indigo-500/15 focus:border-indigo-600',
            Icon ? 'pl-10' : 'pl-3.5',
            error
              ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15 text-rose-900'
              : 'border-slate-200/90',
            props.disabled && 'bg-slate-50/80 text-slate-400 cursor-not-allowed hover:border-slate-200/90',
            className
          )}
          {...props}
        />
      </div>
      {error ? (
        <p className="text-xs text-rose-600 font-medium pl-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 pl-0.5">{helperText}</p>
      ) : null}
    </div>
  )
})
