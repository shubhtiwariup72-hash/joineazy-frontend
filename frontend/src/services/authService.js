import { ROLES } from '../constants/roles'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { generateSimulatedJwt, parseSimulatedJwt } from '../utils/token'
import {
  SEED_ASSIGNMENTS,
  SEED_COURSES,
  SEED_GROUP_ACKNOWLEDGEMENTS,
  SEED_GROUPS,
  SEED_INDIVIDUAL_ACKNOWLEDGEMENTS,
  SEED_USERS,
} from './seedData'
import { getFromStorage, removeFromStorage, saveToStorage } from './storageService'

export function initializeDatabase() {
  const isInitialized = getFromStorage(STORAGE_KEYS.INITIALIZED, false)
  if (!isInitialized) {
    saveToStorage(STORAGE_KEYS.USERS, SEED_USERS)
    saveToStorage(STORAGE_KEYS.COURSES, SEED_COURSES)
    saveToStorage(STORAGE_KEYS.ASSIGNMENTS, SEED_ASSIGNMENTS)
    saveToStorage(STORAGE_KEYS.GROUPS, SEED_GROUPS)
    saveToStorage(STORAGE_KEYS.INDIVIDUAL_ACKNOWLEDGEMENTS, SEED_INDIVIDUAL_ACKNOWLEDGEMENTS)
    saveToStorage(STORAGE_KEYS.GROUP_ACKNOWLEDGEMENTS, SEED_GROUP_ACKNOWLEDGEMENTS)
    saveToStorage(STORAGE_KEYS.INITIALIZED, true)
  }
}

export function getAllUsers() {
  initializeDatabase()
  return getFromStorage(STORAGE_KEYS.USERS, [])
}

export function getUserById(userId) {
  const users = getAllUsers()
  return users.find((user) => user.id === userId) || null
}

export function loginUser(email, password) {
  initializeDatabase()
  const users = getAllUsers()
  const normalizedEmail = email.trim().toLowerCase()
  const user = users.find(
    (item) => item.email.toLowerCase() === normalizedEmail && item.password === password
  )

  if (!user) {
    throw new Error('Invalid email or password.')
  }

  const token = generateSimulatedJwt(user)
  const session = {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
    },
    token,
  }

  saveToStorage(STORAGE_KEYS.SESSION, session)
  return session
}

export function registerUser({ name, email, password, role, department = '' }) {
  initializeDatabase()
  const users = getAllUsers()
  const normalizedEmail = email.trim().toLowerCase()

  const existing = users.find((item) => item.email.toLowerCase() === normalizedEmail)
  if (existing) {
    throw new Error('An account with this email address already exists.')
  }

  const validRoles = [ROLES.PROFESSOR, ROLES.STUDENT]
  if (!validRoles.includes(role)) {
    throw new Error('Please select a valid role.')
  }

  const newUser = {
    id: `user_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
    name: name.trim(),
    email: normalizedEmail,
    password,
    role,
    department: department.trim(),
  }

  users.push(newUser)
  saveToStorage(STORAGE_KEYS.USERS, users)

  if (role === ROLES.STUDENT) {
    const courses = getFromStorage(STORAGE_KEYS.COURSES, [])
    const updatedCourses = courses.map((course) => {
      if (!course.enrolledStudentIds.includes(newUser.id)) {
        return {
          ...course,
          enrolledStudentIds: [...course.enrolledStudentIds, newUser.id],
        }
      }
      return course
    })
    saveToStorage(STORAGE_KEYS.COURSES, updatedCourses)
  }

  const token = generateSimulatedJwt(newUser)
  const session = {
    user: {
      id: newUser.id,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      department: newUser.department,
    },
    token,
  }

  saveToStorage(STORAGE_KEYS.SESSION, session)
  return session
}

export function getCurrentSession() {
  initializeDatabase()
  const session = getFromStorage(STORAGE_KEYS.SESSION, null)
  if (!session || !session.token) {
    return null
  }

  const parsedToken = parseSimulatedJwt(session.token)
  if (!parsedToken) {
    removeFromStorage(STORAGE_KEYS.SESSION)
    return null
  }

  const user = getUserById(parsedToken.sub)
  if (!user) {
    removeFromStorage(STORAGE_KEYS.SESSION)
    return null
  }

  return {
    user: {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role,
      department: user.department || '',
    },
    token: session.token,
  }
}

export function logoutUser() {
  removeFromStorage(STORAGE_KEYS.SESSION)
}

