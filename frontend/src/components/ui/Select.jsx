import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useRef, useState } from 'react'
import { Check, ChevronDown } from 'lucide-react'
import { cn } from '../../utils/cn'

export const Select = forwardRef(function Select(
  {
    label,
    error,
    helperText,
    id,
    value,
    defaultValue,
    onChange,
    options = [],
    placeholder = 'Select an option',
    className = '',
    required = false,
    disabled = false,
    name,
    ...props
  },
  ref
) {
  const generatedId = useId()
  const selectId = id || name || generatedId
  const listboxId = `${selectId}-listbox`

  const [isOpen, setIsOpen] = useState(false)
  const [placement, setPlacement] = useState('bottom')
  const [align, setAlign] = useState('left')

  const containerRef = useRef(null)
  const triggerRef = useRef(null)
  const menuRef = useRef(null)

  const currentValue = value !== undefined ? value : defaultValue

  const selectedOption =
    options.find((opt) => String(opt.value) === String(currentValue)) || null

  const selectedIndex = options.findIndex(
    (opt) => String(opt.value) === String(currentValue)
  )

  const [highlightedIndex, setHighlightedIndex] = useState(
    selectedIndex >= 0 ? selectedIndex : 0
  )

  useImperativeHandle(ref, () => triggerRef.current)

  const updateMenuPosition = useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()
    const spaceBelow = window.innerHeight - rect.bottom
    const spaceAbove = rect.top
    const estimatedHeight = Math.min(options.length * 44 + 16, 260)

    if (spaceBelow < estimatedHeight && spaceAbove > spaceBelow) {
      setPlacement('top')
    } else {
      setPlacement('bottom')
    }

    const spaceRight = window.innerWidth - rect.left
    if (spaceRight < 220 && rect.right > 220) {
      setAlign('right')
    } else {
      setAlign('left')
    }
  }, [options.length])

  function toggleOpen() {
    if (disabled) return
    if (!isOpen) {
      updateMenuPosition()
      setHighlightedIndex(selectedIndex >= 0 ? selectedIndex : 0)
      setIsOpen(true)
    } else {
      setIsOpen(false)
    }
  }

  function handleSelect(option) {
    if (option.disabled || disabled) return
    setIsOpen(false)
    if (triggerRef.current) {
      triggerRef.current.focus()
    }
    if (onChange) {
      onChange({
        target: {
          name: name || selectId,
          value: option.value,
        },
      })
    }
  }

  function handleKeyDown(event) {
    if (disabled) return

    if (event.key === 'ArrowDown') {
      event.preventDefault()
      if (!isOpen) {
        updateMenuPosition()
        setIsOpen(true)
      } else {
        setHighlightedIndex((prev) => (prev < options.length - 1 ? prev + 1 : 0))
      }
    } else if (event.key === 'ArrowUp') {
      event.preventDefault()
      if (!isOpen) {
        updateMenuPosition()
        setIsOpen(true)
      } else {
        setHighlightedIndex((prev) => (prev > 0 ? prev - 1 : options.length - 1))
      }
    } else if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      if (!isOpen) {
        updateMenuPosition()
        setIsOpen(true)
      } else if (highlightedIndex >= 0 && options[highlightedIndex]) {
        handleSelect(options[highlightedIndex])
      }
    } else if (event.key === 'Escape') {
      if (isOpen) {
        event.preventDefault()
        setIsOpen(false)
        triggerRef.current?.focus()
      }
    } else if (event.key === 'Tab') {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (!isOpen) return

    function handleClickOutside(event) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target) &&
        (!menuRef.current || !menuRef.current.contains(event.target))
      ) {
        setIsOpen(false)
      }
    }

    function handleResizeOrScroll() {
      updateMenuPosition()
    }

    document.addEventListener('mousedown', handleClickOutside)
    document.addEventListener('touchstart', handleClickOutside)
    window.addEventListener('resize', handleResizeOrScroll)
    window.addEventListener('scroll', handleResizeOrScroll, true)

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
      document.removeEventListener('touchstart', handleClickOutside)
      window.removeEventListener('resize', handleResizeOrScroll)
      window.removeEventListener('scroll', handleResizeOrScroll, true)
    }
  }, [isOpen, updateMenuPosition])

  useEffect(() => {
    if (isOpen && menuRef.current && highlightedIndex >= 0) {
      const items = menuRef.current.querySelectorAll('[role="option"]')
      const target = items[highlightedIndex]
      if (target) {
        target.scrollIntoView({ block: 'nearest' })
      }
    }
  }, [isOpen, highlightedIndex])

  return (
    <div
      ref={containerRef}
      className={cn('relative w-full min-w-0 max-w-full space-y-1.5 text-left', className)}
    >
      {label && (
        <label
          htmlFor={selectId}
          className="block text-xs font-semibold text-slate-700 tracking-wide select-none"
        >
          {label}
          {required && <span className="text-rose-500 ml-1 font-bold">*</span>}
        </label>
      )}

      <button
        ref={triggerRef}
        id={selectId}
        type="button"
        role="combobox"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={toggleOpen}
        onKeyDown={handleKeyDown}
        title={selectedOption ? selectedOption.label : placeholder}
        className={cn(
          'min-h-[44px] h-11 w-full rounded-xl border bg-white px-3.5 py-2 text-sm text-slate-900 shadow-2xs transition-all duration-150',
          'flex items-center justify-between gap-2 cursor-pointer select-none text-left',
          'hover:border-slate-300 focus:outline-none focus:ring-3 focus:ring-indigo-500/15 focus:border-indigo-600',
          isOpen && 'border-indigo-600 ring-3 ring-indigo-500/15',
          error
            ? 'border-rose-300 focus:border-rose-500 focus:ring-rose-500/15 text-rose-900'
            : 'border-slate-200/90',
          disabled &&
            'bg-slate-50/80 text-slate-400 cursor-not-allowed hover:border-slate-200/90 shadow-none'
        )}
        {...props}
      >
        <span
          className={cn(
            'truncate flex-1 min-w-0 font-medium',
            selectedOption ? 'text-slate-800' : 'text-slate-400'
          )}
        >
          {selectedOption ? selectedOption.label : placeholder}
        </span>
        <ChevronDown
          className={cn(
            'h-4 w-4 text-slate-400 shrink-0 transition-transform duration-200',
            isOpen && 'rotate-180 text-indigo-600'
          )}
        />
      </button>

      {isOpen && (
        <div
          ref={menuRef}
          id={listboxId}
          role="listbox"
          tabIndex={-1}
          className={cn(
            'absolute z-[70] min-w-full w-full max-w-[calc(100vw-2rem)] rounded-xl border border-slate-200/90 bg-white p-1.5 shadow-xl transition-all duration-150',
            placement === 'top' ? 'bottom-full mb-1.5' : 'top-full mt-1.5',
            align === 'right' ? 'right-0' : 'left-0'
          )}
        >
          <div className="max-h-60 overflow-y-auto overscroll-contain space-y-0.5 focus:outline-none">
            {options.length === 0 ? (
              <div className="px-3 py-3 text-center text-xs text-slate-400">
                No options available
              </div>
            ) : (
              options.map((option, index) => {
                const isSelected = String(option.value) === String(currentValue)
                const isHighlighted = highlightedIndex === index
                return (
                  <div
                    key={option.value}
                    role="option"
                    aria-selected={isSelected}
                    title={option.label}
                    onClick={() => handleSelect(option)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    className={cn(
                      'flex min-h-[44px] w-full items-center justify-between gap-2.5 rounded-lg px-3 py-2.5 text-sm transition-colors cursor-pointer select-none',
                      isSelected
                        ? 'bg-indigo-50/90 text-indigo-700 font-semibold'
                        : isHighlighted
                        ? 'bg-slate-100/90 text-slate-900 font-medium'
                        : 'text-slate-700 hover:bg-slate-50 font-normal',
                      option.disabled &&
                        'opacity-40 cursor-not-allowed pointer-events-none'
                    )}
                  >
                    <span className="truncate flex-1 min-w-0 text-left">
                      {option.label}
                    </span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-indigo-600 shrink-0 ml-1.5" />
                    )}
                  </div>
                )
              })
            )}
          </div>
        </div>
      )}

      {error ? (
        <p className="text-xs text-rose-600 font-medium pl-0.5">{error}</p>
      ) : helperText ? (
        <p className="text-xs text-slate-500 pl-0.5">{helperText}</p>
      ) : null}
    </div>
  )
})
