import { ROLES } from '../constants/roles'
import { SUBMISSION_TYPES } from '../constants/submissionTypes'

export const SEED_USERS = [
  {
    id: 'user_prof_1',
    name: 'Dr. Sarah Jenkins',
    email: 'professor@joineazy.edu',
    password: 'password123',
    role: ROLES.PROFESSOR,
    department: 'Computer Science & Engineering',
  },
  {
    id: 'user_stud_1',
    name: 'Alex Rivera',
    email: 'student1@joineazy.edu',
    password: 'password123',
    role: ROLES.STUDENT,
    department: 'Computer Science',
  },
  {
    id: 'user_stud_2',
    name: 'Elena Chen',
    email: 'student2@joineazy.edu',
    password: 'password123',
    role: ROLES.STUDENT,
    department: 'Software Engineering',
  },
  {
    id: 'user_stud_3',
    name: 'Marcus Vance',
    email: 'student3@joineazy.edu',
    password: 'password123',
    role: ROLES.STUDENT,
    department: 'Computer Science',
  },
  {
    id: 'user_stud_4',
    name: 'Priya Sharma',
    email: 'student4@joineazy.edu',
    password: 'password123',
    role: ROLES.STUDENT,
    department: 'Information Systems',
  },
]

export const SEED_COURSES = [
  {
    id: 'course_cs401',
    code: 'CS-401',
    title: 'Advanced Cloud & Distributed Systems',
    description: 'Deep dive into consensus algorithms, cloud infrastructure, fault tolerance, and microservices.',
    professorId: 'user_prof_1',
    term: 'Spring 2026',
    enrolledStudentIds: ['user_stud_1', 'user_stud_2', 'user_stud_3', 'user_stud_4'],
  },
  {
    id: 'course_cs302',
    code: 'CS-302',
    title: 'Modern Full-Stack Web Architecture',
    description: 'Production frontend engineering, state management, REST/GraphQL APIs, and deployment pipelines.',
    professorId: 'user_prof_1',
    term: 'Spring 2026',
    enrolledStudentIds: ['user_stud_1', 'user_stud_2', 'user_stud_4'],
  },
  {
    id: 'course_cs205',
    code: 'CS-205',
    title: 'Data Structures & Algorithms Lab',
    description: 'Hands-on practical implementation of complex graphs, dynamic programming, and search trees.',
    professorId: 'user_prof_1',
    term: 'Spring 2026',
    enrolledStudentIds: ['user_stud_1', 'user_stud_3'],
  },
]

const now = Date.now()
const oneDayMs = 24 * 60 * 60 * 1000

export const SEED_ASSIGNMENTS = [
  {
    id: 'assign_101',
    courseId: 'course_cs401',
    title: 'Distributed Consensus Protocol (Raft Implementation)',
    description: 'Implement leader election and log replication with persistent storage simulation.',
    deadline: new Date(now + 5 * oneDayMs).toISOString(),
    oneDriveUrl: 'https://onedrive.live.com/view.aspx?cid=joineazy-raft-protocol',
    submissionType: SUBMISSION_TYPES.INDIVIDUAL,
    createdAt: new Date(now - 3 * oneDayMs).toISOString(),
    updatedAt: new Date(now - 3 * oneDayMs).toISOString(),
  },
  {
    id: 'assign_102',
    courseId: 'course_cs401',
    title: 'Kubernetes Multi-Node Cluster Orchestration Report',
    description: 'Deploy ingress controllers, stateful sets, and automated rollouts with comprehensive metrics.',
    deadline: new Date(now + 10 * oneDayMs).toISOString(),
    oneDriveUrl: 'https://onedrive.live.com/view.aspx?cid=joineazy-k8s-orchestration',
    submissionType: SUBMISSION_TYPES.GROUP,
    createdAt: new Date(now - 2 * oneDayMs).toISOString(),
    updatedAt: new Date(now - 2 * oneDayMs).toISOString(),
  },
  {
    id: 'assign_103',
    courseId: 'course_cs401',
    title: 'Distributed Cache Benchmarking & Eviction Policies',
    description: 'Benchmark LRU versus LFU hit rates across high-throughput write-heavy workloads.',
    deadline: new Date(now - 2 * oneDayMs).toISOString(),
    oneDriveUrl: 'https://onedrive.live.com/view.aspx?cid=joineazy-cache-benchmark',
    submissionType: SUBMISSION_TYPES.INDIVIDUAL,
    createdAt: new Date(now - 7 * oneDayMs).toISOString(),
    updatedAt: new Date(now - 7 * oneDayMs).toISOString(),
  },
  {
    id: 'assign_201',
    courseId: 'course_cs302',
    title: 'Modular Micro-Frontend Architecture with Vite',
    description: 'Architect decoupled applications sharing common authentication and design system modules.',
    deadline: new Date(now + 7 * oneDayMs).toISOString(),
    oneDriveUrl: 'https://onedrive.live.com/view.aspx?cid=joineazy-microfrontend',
    submissionType: SUBMISSION_TYPES.INDIVIDUAL,
    createdAt: new Date(now - 1 * oneDayMs).toISOString(),
    updatedAt: new Date(now - 1 * oneDayMs).toISOString(),
  },
  {
    id: 'assign_202',
    courseId: 'course_cs302',
    title: 'Real-Time Collaborative Canvas Engine',
    description: 'Build low-latency canvas synchronization with Conflict-free Replicated Data Types (CRDT).',
    deadline: new Date(now + 14 * oneDayMs).toISOString(),
    oneDriveUrl: 'https://onedrive.live.com/view.aspx?cid=joineazy-collab-canvas',
    submissionType: SUBMISSION_TYPES.GROUP,
    createdAt: new Date(now - 1 * oneDayMs).toISOString(),
    updatedAt: new Date(now - 1 * oneDayMs).toISOString(),
  },
]

export const SEED_GROUPS = [
  {
    id: 'group_401_1',
    courseId: 'course_cs401',
    name: 'Distributed Pioneers',
    leaderId: 'user_stud_1',
    memberIds: ['user_stud_1', 'user_stud_2'],
    createdAt: new Date(now - 2 * oneDayMs).toISOString(),
  },
]

export const SEED_INDIVIDUAL_ACKNOWLEDGEMENTS = [
  {
    id: 'ack_indiv_1',
    assignmentId: 'assign_101',
    courseId: 'course_cs401',
    studentId: 'user_stud_3',
    acknowledgedAt: new Date(now - 1 * oneDayMs).toISOString(),
    oneDriveViewed: true,
  },
  {
    id: 'ack_indiv_2',
    assignmentId: 'assign_201',
    courseId: 'course_cs302',
    studentId: 'user_stud_2',
    acknowledgedAt: new Date(now - 12 * 60 * 60 * 1000).toISOString(),
    oneDriveViewed: true,
  },
]

export const SEED_GROUP_ACKNOWLEDGEMENTS = []

