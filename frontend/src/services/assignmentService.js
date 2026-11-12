import { ACKNOWLEDGEMENT_STATUS } from '../constants/assignmentStatuses'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { SUBMISSION_TYPES } from '../constants/submissionTypes'
import { isPastDeadline } from '../utils/dateTime'
import {
  getAllGroupAcknowledgements,
  getAllIndividualAcknowledgements,
} from './acknowledgementService'
import { initializeDatabase } from './authService'
import { getCourseById, getCourseStudents } from './courseService'
import { getGroupsForCourse, getHydratedGroup } from './groupService'
import { getFromStorage, saveToStorage } from './storageService'

export function getAllAssignments() {
  initializeDatabase()
  return getFromStorage(STORAGE_KEYS.ASSIGNMENTS, [])
}

export function getAssignmentsForCourse(courseId) {
  const assignments = getAllAssignments()
  return assignments.filter((item) => item.courseId === courseId)
}

export function getAssignmentById(assignmentId) {
  const assignments = getAllAssignments()
  return assignments.find((item) => item.id === assignmentId) || null
}

export function createAssignment({
  courseId,
  title,
  description,
  deadline,
  oneDriveUrl,
  submissionType,
}) {
  const course = getCourseById(courseId)
  if (!course) {
    throw new Error('Course not found.')
  }

  const trimmedTitle = title ? title.trim() : ''
  if (!trimmedTitle) {
    throw new Error('Assignment title is required.')
  }

  if (!deadline) {
    throw new Error('Deadline date and time is required.')
  }

  const validTypes = [SUBMISSION_TYPES.INDIVIDUAL, SUBMISSION_TYPES.GROUP]
  if (!validTypes.includes(submissionType)) {
    throw new Error('Invalid submission type.')
  }

  const nowIso = new Date().toISOString()
  const newAssignment = {
    id: `assign_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    courseId,
    title: trimmedTitle,
    description: description ? description.trim() : '',
    deadline: new Date(deadline).toISOString(),
    oneDriveUrl: oneDriveUrl ? oneDriveUrl.trim() : '',
    submissionType,
    createdAt: nowIso,
    updatedAt: nowIso,
  }

  const allAssignments = getAllAssignments()
  allAssignments.unshift(newAssignment)
  saveToStorage(STORAGE_KEYS.ASSIGNMENTS, allAssignments)

  return newAssignment
}

export function updateAssignment(assignmentId, updates) {
  const allAssignments = getAllAssignments()
  const index = allAssignments.findIndex((item) => item.id === assignmentId)
  if (index === -1) {
    throw new Error('Assignment not found.')
  }

  const current = allAssignments[index]
  const updated = {
    ...current,
    title: updates.title !== undefined ? updates.title.trim() : current.title,
    description: updates.description !== undefined ? updates.description.trim() : current.description,
    deadline: updates.deadline ? new Date(updates.deadline).toISOString() : current.deadline,
    oneDriveUrl: updates.oneDriveUrl !== undefined ? updates.oneDriveUrl.trim() : current.oneDriveUrl,
    submissionType: updates.submissionType || current.submissionType,
    updatedAt: new Date().toISOString(),
  }

  allAssignments[index] = updated
  saveToStorage(STORAGE_KEYS.ASSIGNMENTS, allAssignments)

  return updated
}

export function deleteAssignment(assignmentId) {
  const allAssignments = getAllAssignments()
  const filtered = allAssignments.filter((item) => item.id !== assignmentId)
  saveToStorage(STORAGE_KEYS.ASSIGNMENTS, filtered)

  const indivAcks = getAllIndividualAcknowledgements().filter(
    (item) => item.assignmentId !== assignmentId
  )
  saveToStorage(STORAGE_KEYS.INDIVIDUAL_ACKNOWLEDGEMENTS, indivAcks)

  const grpAcks = getAllGroupAcknowledgements().filter(
    (item) => item.assignmentId !== assignmentId
  )
  saveToStorage(STORAGE_KEYS.GROUP_ACKNOWLEDGEMENTS, grpAcks)

  return true
}

export function getAssignmentSubmissionStats(assignmentId) {
  const assignment = getAssignmentById(assignmentId)
  if (!assignment) {
    return {
      total: 0,
      submitted: 0,
      pending: 0,
      percentage: 0,
      records: [],
    }
  }

  const isOverdue = isPastDeadline(assignment.deadline)

  if (assignment.submissionType === SUBMISSION_TYPES.INDIVIDUAL) {
    const students = getCourseStudents(assignment.courseId)
    const acknowledgements = getAllIndividualAcknowledgements().filter(
      (item) => item.assignmentId === assignmentId
    )

    const ackMap = new Map(acknowledgements.map((item) => [item.studentId, item]))

    const records = students.map((student) => {
      const ack = ackMap.get(student.id)
      let status = ACKNOWLEDGEMENT_STATUS.PENDING
      if (ack) {
        status = ACKNOWLEDGEMENT_STATUS.SUBMITTED
      } else if (isOverdue) {
        status = ACKNOWLEDGEMENT_STATUS.OVERDUE
      }

      return {
        id: student.id,
        name: student.name,
        email: student.email,
        status,
        acknowledgedAt: ack ? ack.acknowledgedAt : null,
      }
    })

    const total = students.length
    const submitted = acknowledgements.length
    const pending = Math.max(0, total - submitted)
    const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0

    return {
      total,
      submitted,
      pending,
      percentage,
      records,
    }
  }

  const rawGroups = getGroupsForCourse(assignment.courseId)
  const hydratedGroups = rawGroups.map(getHydratedGroup)
  const groupAcks = getAllGroupAcknowledgements().filter(
    (item) => item.assignmentId === assignmentId
  )
  const groupAckMap = new Map(groupAcks.map((item) => [item.groupId, item]))

  const records = hydratedGroups.map((group) => {
    const ack = groupAckMap.get(group.id)
    let status = ACKNOWLEDGEMENT_STATUS.PENDING
    if (ack) {
      status = ACKNOWLEDGEMENT_STATUS.SUBMITTED
    } else if (isOverdue) {
      status = ACKNOWLEDGEMENT_STATUS.OVERDUE
    }

    return {
      id: group.id,
      name: group.name,
      leaderName: group.leader ? group.leader.name : 'Unknown Leader',
      memberCount: group.members.length,
      status,
      acknowledgedAt: ack ? ack.acknowledgedAt : null,
      acknowledgedByName: ack ? ack.acknowledgedByName : null,
    }
  })

  const total = hydratedGroups.length
  const submitted = groupAcks.length
  const pending = Math.max(0, total - submitted)
  const percentage = total > 0 ? Math.round((submitted / total) * 100) : 0

  return {
    total,
    submitted,
    pending,
    percentage,
    records,
  }
}
