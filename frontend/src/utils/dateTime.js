export function formatDateTime(isoString) {
  if (!isoString) return 'N/A'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return 'Invalid date'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  }).format(date)
}

export function formatDate(isoString) {
  if (!isoString) return 'N/A'
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return 'Invalid date'
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(date)
}

export function isPastDeadline(deadlineIso) {
  if (!deadlineIso) return false
  const deadline = new Date(deadlineIso)
  return deadline.getTime() < Date.now()
}

export function getRemainingTimeText(deadlineIso) {
  if (!deadlineIso) return ''
  const deadline = new Date(deadlineIso)
  const now = new Date()
  const diffMs = deadline.getTime() - now.getTime()

  if (diffMs <= 0) {
    return 'Overdue'
  }

  const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
  const diffDays = Math.floor(diffHours / 24)

  if (diffDays > 0) {
    return `${diffDays} day${diffDays > 1 ? 's' : ''} left`
  }

  if (diffHours > 0) {
    return `${diffHours} hr${diffHours > 1 ? 's' : ''} left`
  }

  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  return `${Math.max(1, diffMinutes)} min left`
}

export function toInputDateTimeLocal(isoString) {
  if (!isoString) return ''
  const date = new Date(isoString)
  if (isNaN(date.getTime())) return ''
  const offset = date.getTimezoneOffset()
  const localDate = new Date(date.getTime() - offset * 60 * 1000)
  return localDate.toISOString().slice(0, 16)
}

