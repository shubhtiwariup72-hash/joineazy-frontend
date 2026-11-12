import { STORAGE_KEYS } from '../constants/storageKeys'
import { initializeDatabase, getAllUsers } from './authService'
import { getFromStorage } from './storageService'

export function getAllCourses() {
  initializeDatabase()
  return getFromStorage(STORAGE_KEYS.COURSES, [])
}

export function getCoursesForProfessor(professorId) {
  const courses = getAllCourses()
  return courses.filter((course) => course.professorId === professorId)
}

export function getCoursesForStudent(studentId) {
  const courses = getAllCourses()
  return courses.filter((course) => course.enrolledStudentIds.includes(studentId))
}

export function getCourseById(courseId) {
  const courses = getAllCourses()
  return courses.find((course) => course.id === courseId) || null
}

export function getCourseStudents(courseId) {
  const course = getCourseById(courseId)
  if (!course) return []
  const allUsers = getAllUsers()
  return allUsers.filter((user) => course.enrolledStudentIds.includes(user.id))
}

