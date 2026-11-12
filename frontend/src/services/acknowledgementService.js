import { ACKNOWLEDGEMENT_STATUS } from '../constants/assignmentStatuses'
import { STORAGE_KEYS } from '../constants/storageKeys'
import { SUBMISSION_TYPES } from '../constants/submissionTypes'
import { isPastDeadline } from '../utils/dateTime'
import { getUserById, initializeDatabase } from './authService'
import { getStudentGroupForCourse } from './groupService'
import { getFromStorage, saveToStorage } from './storageService'

export function getAllIndividualAcknowledgements() {
  initializeDatabase()
  return getFromStorage(STORAGE_KEYS.INDIVIDUAL_ACKNOWLEDGEMENTS, [])
}

export function getAllGroupAcknowledgements() {
  initializeDatabase()
  return getFromStorage(STORAGE_KEYS.GROUP_ACKNOWLEDGEMENTS, [])
}

export function getIndividualAcknowledgement(assignmentId, studentId) {
  const records = getAllIndividualAcknowledgements()
  return (
    records.find(
      (item) => item.assignmentId === assignmentId && item.studentId === studentId
    ) || null
  )
}

export function getGroupAcknowledgement(assignmentId, groupId) {
  if (!groupId) return null
  const records = getAllGroupAcknowledgements()
  return (
    records.find(
      (item) => item.assignmentId === assignmentId && item.groupId === groupId
    ) || null
  )
}

export function acknowledgeIndividualAssignment({ assignmentId, studentId, courseId }) {
  const existing = getIndividualAcknowledgement(assignmentId, studentId)
  if (existing) {
    throw new Error('This assignment has already been acknowledged.')
  }

  const newAck = {
    id: `ack_indiv_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    assignmentId,
    courseId,
    studentId,
    acknowledgedAt: new Date().toISOString(),
    oneDriveViewed: true,
  }

  const records = getAllIndividualAcknowledgements()
  records.push(newAck)
  saveToStorage(STORAGE_KEYS.INDIVIDUAL_ACKNOWLEDGEMENTS, records)

  return newAck
}

export function acknowledgeGroupAssignment({ assignmentId, groupId, leaderId, courseId }) {
  const existing = getGroupAcknowledgement(assignmentId, groupId)
  if (existing) {
    throw new Error('This group assignment has already been acknowledged.')
  }

  const leader = getUserById(leaderId)
  const leaderName = leader ? leader.name : 'Group Leader'

  const newAck = {
    id: `ack_grp_${Date.now()}_${Math.random().toString(36).substring(2, 6)}`,
    assignmentId,
    groupId,
    courseId,
    acknowledgedById: leaderId,
    acknowledgedByName: leaderName,
    acknowledgedAt: new Date().toISOString(),
  }

  const records = getAllGroupAcknowledgements()
  records.push(newAck)
  saveToStorage(STORAGE_KEYS.GROUP_ACKNOWLEDGEMENTS, records)

  return newAck
}

export function evaluateStudentAssignmentStatus(assignment, studentId) {
  const isOverdue = isPastDeadline(assignment.deadline)

  if (assignment.submissionType === SUBMISSION_TYPES.INDIVIDUAL) {
    const ack = getIndividualAcknowledgement(assignment.id, studentId)
    if (ack) {
      return {
        status: ACKNOWLEDGEMENT_STATUS.SUBMITTED,
        isAcknowledged: true,
        acknowledgedAt: ack.acknowledgedAt,
        acknowledgedByName: null,
        canAcknowledge: false,
        reason: 'Yes, I have submitted',
        hasGroup: true,
        isGroupLeader: false,
        studentGroup: null,
      }
    }

    if (isOverdue) {
      return {
        status: ACKNOWLEDGEMENT_STATUS.OVERDUE,
        isAcknowledged: false,
        acknowledgedAt: null,
        acknowledgedByName: null,
        canAcknowledge: false,
        reason: 'The deadline for this assignment has expired.',
        hasGroup: true,
        isGroupLeader: false,
        studentGroup: null,
      }
    }

    return {
      status: ACKNOWLEDGEMENT_STATUS.PENDING,
      isAcknowledged: false,
      acknowledgedAt: null,
      acknowledgedByName: null,
      canAcknowledge: true,
      reason: null,
      hasGroup: true,
      isGroupLeader: false,
      studentGroup: null,
    }
  }

  const studentGroup = getStudentGroupForCourse(assignment.courseId, studentId)

  if (!studentGroup) {
    return {
      status: isOverdue ? ACKNOWLEDGEMENT_STATUS.OVERDUE : ACKNOWLEDGEMENT_STATUS.PENDING,
      isAcknowledged: false,
      acknowledgedAt: null,
      acknowledgedByName: null,
      canAcknowledge: false,
      reason: 'You are not part of any group. Create or join one to submit this assignment.',
      hasGroup: false,
      isGroupLeader: false,
      studentGroup: null,
    }
  }

  const groupAck = getGroupAcknowledgement(assignment.id, studentGroup.id)
  const isLeader = studentGroup.leaderId === studentId

  if (groupAck) {
    return {
      status: ACKNOWLEDGEMENT_STATUS.SUBMITTED,
      isAcknowledged: true,
      acknowledgedAt: groupAck.acknowledgedAt,
      acknowledgedByName: groupAck.acknowledgedByName,
      canAcknowledge: false,
      reason: `Acknowledged by ${groupAck.acknowledgedByName}`,
      hasGroup: true,
      isGroupLeader: isLeader,
      studentGroup,
    }
  }

  if (isOverdue) {
    return {
      status: ACKNOWLEDGEMENT_STATUS.OVERDUE,
      isAcknowledged: false,
      acknowledgedAt: null,
      acknowledgedByName: null,
      canAcknowledge: false,
      reason: 'The deadline for this assignment has expired.',
      hasGroup: true,
      isGroupLeader: isLeader,
      studentGroup,
    }
  }

  if (!isLeader) {
    return {
      status: ACKNOWLEDGEMENT_STATUS.PENDING,
      isAcknowledged: false,
      acknowledgedAt: null,
      acknowledgedByName: null,
      canAcknowledge: false,
      reason: `Only the group leader (${studentGroup.leaderId ? getUserById(studentGroup.leaderId)?.name || 'Leader' : 'Leader'}) can acknowledge this assignment.`,
      hasGroup: true,
      isGroupLeader: false,
      studentGroup,
    }
  }

  return {
    status: ACKNOWLEDGEMENT_STATUS.PENDING,
    isAcknowledged: false,
    acknowledgedAt: null,
    acknowledgedByName: null,
    canAcknowledge: true,
    reason: null,
    hasGroup: true,
    isGroupLeader: true,
    studentGroup,
  }
}
