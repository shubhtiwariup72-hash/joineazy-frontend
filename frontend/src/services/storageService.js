export function getFromStorage(key, defaultValue = null) {
  try {
    const rawValue = localStorage.getItem(key)
    if (rawValue === null) {
      return defaultValue
    }
    return JSON.parse(rawValue)
  } catch {
    return defaultValue
  }
}

export function saveToStorage(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch {
    return false
  }
}

export function removeFromStorage(key) {
  try {
    localStorage.removeItem(key)
    return true
  } catch {
    return false
  }
}

