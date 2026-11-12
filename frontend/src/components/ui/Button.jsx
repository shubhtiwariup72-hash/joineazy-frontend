import { cn } from '../../utils/cn'

const VARIANTS = {
  primary: 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98] shadow-xs shadow-indigo-600/20 focus-visible:ring-indigo-500 border border-indigo-700/20',
  secondary: 'bg-white text-slate-700 border border-slate-200/90 hover:bg-slate-50/90 hover:border-slate-300 active:scale-[0.98] shadow-2xs focus-visible:ring-slate-400',
  outline: 'bg-transparent text-indigo-600 border border-indigo-200 hover:bg-indigo-50/80 hover:border-indigo-300 active:scale-[0.98] focus-visible:ring-indigo-500',
  danger: 'bg-rose-600 text-white hover:bg-rose-700 active:scale-[0.98] shadow-xs shadow-rose-600/20 focus-visible:ring-rose-500 border border-rose-700/20',
  ghost: 'bg-transparent text-slate-600 hover:bg-slate-100 hover:text-slate-900 active:scale-[0.98] focus-visible:ring-slate-400',
  success: 'bg-emerald-600 text-white hover:bg-emerald-700 active:scale-[0.98] shadow-xs shadow-emerald-600/20 focus-visible:ring-emerald-500 border border-emerald-700/20',
}

const SIZES = {
  sm: 'min-h-[36px] px-3 py-1.5 text-xs font-semibold rounded-lg gap-1.5',
  md: 'min-h-[44px] px-4 py-2 text-sm font-semibold rounded-xl gap-2',
  lg: 'min-h-[48px] px-5 py-2.5 text-base font-semibold rounded-xl gap-2.5',
}

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  type = 'button',
  disabled = false,
  isLoading = false,
  icon: Icon,
  className = '',
  onClick,
  ...props
}) {
  return (
    <button
      type={type}
      disabled={disabled || isLoading}
      onClick={onClick}
      className={cn(
        'inline-flex items-center justify-center transition-all duration-150 cursor-pointer select-none font-semibold',
        'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2',
        'disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none disabled:active:scale-100',
        VARIANTS[variant] || VARIANTS.primary,
        SIZES[size] || SIZES.md,
        className
      )}
      {...props}
    >
      {isLoading ? (
        <svg
          className="animate-spin -ml-0.5 h-4 w-4 text-current"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8z"
          />
        </svg>
      ) : Icon ? (
        <Icon className="h-4 w-4 shrink-0" />
      ) : null}
      {children}
    </button>
  )
}
