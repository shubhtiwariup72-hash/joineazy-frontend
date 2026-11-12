import { AlertTriangle, Info } from 'lucide-react'
import { Button } from './Button'
import { Modal } from './Modal'

export function ConfirmDialog({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  variant = 'primary',
  isLoading = false,
}) {
  const isDanger = variant === 'danger'

  return (
    <Modal isOpen={isOpen} onClose={onClose} maxWidth="max-w-md">
      <div className="flex flex-col items-center text-center space-y-4">
        <div
          className={`flex h-12 w-12 items-center justify-center rounded-full ${
            isDanger ? 'bg-rose-100 text-rose-600' : 'bg-indigo-100 text-indigo-600'
          }`}
        >
          {isDanger ? (
            <AlertTriangle className="h-6 w-6" />
          ) : (
            <Info className="h-6 w-6" />
          )}
        </div>
        <div className="space-y-1.5">
          <h4 className="text-lg font-semibold text-slate-900">{title}</h4>
          <p className="text-sm text-slate-600 max-w-sm">{message}</p>
        </div>
        <div className="flex flex-col-reverse sm:flex-row w-full sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            {cancelText}
          </Button>
          <Button
            type="button"
            variant={variant}
            onClick={onConfirm}
            isLoading={isLoading}
            className="w-full sm:w-auto"
          >
            {confirmText}
          </Button>
        </div>
      </div>
    </Modal>
  )
}

