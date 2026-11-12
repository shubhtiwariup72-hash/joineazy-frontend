import { STORAGE_KEYS } from '../constants/storageKeys'
import { initializeDatabase, getAllUsers } from './authService'
import { getCourseById } from './courseService'
import { getFromStorage, saveToStorage } from './storageService'

export function getAllGroups() {
  initializeDatabase()
  return getFromStorage(STORAGE_KEYS.GROUPS, [])
}

export function getGroupsForCourse(courseId) {
  const groups = getAllGroups()
  return groups.filter((group) => group.courseId === courseId)
}

export function getStudentGroupForCourse(courseId, studentId) {
  const courseGroups = getGroupsForCourse(courseId)
  return courseGroups.find((group) => group.memberIds.includes(studentId)) || null
}

export function createGroup({ courseId, name, creatorStudentId }) {
  const course = getCourseById(courseId)
  if (!course) {
    throw new Error('Course not found.')
  }

  if (!course.enrolledStudentIds.includes(creatorStudentId)) {
    throw new Error('You must be enrolled in this course to form a group.')
  }

  const existingMembership = getStudentGroupForCourse(courseId, creatorStudentId)
  if (existingMembership) {
    throw new Error('You are already a member of a group in this course.')
  }

  const trimmedName = name ? name.trim() : ''
  if (!trimmedName) {
    throw new Error('Group name is required.')
  }

  const courseGroups = getGroupsForCourse(courseId)
  const nameCollision = courseGroups.some(
    (group) => group.name.toLowerCase() === trimmedName.toLowerCase()
  )
  if (nameCollision) {
    throw new Error('A group with this name already exists in this course.')
  }

  const newGroup = {
    id: `group_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    courseId,
    name: trimmedName,
    leaderId: creatorStudentId,
    memberIds: [creatorStudentId],
    createdAt: new Date().toISOString(),
  }

  const allGroups = getAllGroups()
  allGroups.push(newGroup)
  saveToStorage(STORAGE_KEYS.GROUPS, allGroups)

  return newGroup
}

export function joinGroup({ groupId, studentId }) {
  const allGroups = getAllGroups()
  const groupIndex = allGroups.findIndex((item) => item.id === groupId)
  if (groupIndex === -1) {
    throw new Error('Group not found.')
  }

  const targetGroup = allGroups[groupIndex]
  const course = getCourseById(targetGroup.courseId)
  if (!course || !course.enrolledStudentIds.includes(studentId)) {
    throw new Error('You are not enrolled in this course.')
  }

  const existingMembership = getStudentGroupForCourse(targetGroup.courseId, studentId)
  if (existingMembership) {
    throw new Error('You already belong to a group in this course.')
  }

  if (targetGroup.memberIds.includes(studentId)) {
    throw new Error('You are already in this group.')
  }

  const updatedGroup = {
    ...targetGroup,
    memberIds: [...targetGroup.memberIds, studentId],
  }

  allGroups[groupIndex] = updatedGroup
  saveToStorage(STORAGE_KEYS.GROUPS, allGroups)

  return updatedGroup
}

export function getHydratedGroup(group) {
  if (!group) return null
  const allUsers = getAllUsers()
  const leader = allUsers.find((user) => user.id === group.leaderId) || null
  const members = allUsers.filter((user) => group.memberIds.includes(user.id))

  return {
    ...group,
    leader,
    members,
  }
}

