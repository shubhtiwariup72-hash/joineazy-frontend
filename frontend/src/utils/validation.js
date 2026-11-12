export function validateEmail(email) {
  if (!email || typeof email !== 'string') return 'Email is required'
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!pattern.test(email.trim())) return 'Please enter a valid email address'
  return ''
}

export function validatePassword(password) {
  if (!password) return 'Password is required'
  if (password.length < 6) return 'Password must be at least 6 characters'
  return ''
}

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return ''
}

export function validateUrl(url, fieldName = 'URL') {
  if (!url || !url.trim()) return `${fieldName} is required`
  try {
    const parsed = new URL(url.trim())
    if (parsed.protocol !== 'http:' && parsed.protocol !== 'https:') {
      return `${fieldName} must begin with http:// or https://`
    }
    return ''
  } catch {
    return `Please enter a valid ${fieldName}`
  }
}

export function validateFutureDate(dateString, fieldName = 'Deadline') {
  if (!dateString) return `${fieldName} is required`
  const date = new Date(dateString)
  if (isNaN(date.getTime())) return `Please enter a valid ${fieldName}`
  return ''
}

