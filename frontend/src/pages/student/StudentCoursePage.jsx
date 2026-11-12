import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import {
  ArrowLeft,
  Calendar,
  CheckCircle2,
  Clock,
  ExternalLink,
  Filter,
  Search,
  Users,
  XCircle,
} from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Select } from '../../components/ui/Select'
import { ACKNOWLEDGEMENT_STATUS } from '../../constants/assignmentStatuses'
import { SUBMISSION_TYPES } from '../../constants/submissionTypes'
import { useAuth } from '../../hooks/useAuth'
import { useCourseData } from '../../hooks/useCourseData'
import {
  evaluateStudentAssignmentStatus,
} from '../../services/acknowledgementService'
import { getAssignmentsForCourse } from '../../services/assignmentService'
import { getCourseById } from '../../services/courseService'
import { getStudentGroupForCourse } from '../../services/groupService'
import { formatDateTime, getRemainingTimeText } from '../../utils/dateTime'
import { AcknowledgeModal } from './AcknowledgeModal'

export function StudentCoursePage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const { dataVersion } = useCourseData()

  const [course, setCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [studentGroup, setStudentGroup] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [selectedAssignmentForAck, setSelectedAssignmentForAck] = useState(null)

  useEffect(() => {
    if (courseId && user?.id) {
      const foundCourse = getCourseById(courseId)
      setCourse(foundCourse)

      const courseAssignments = getAssignmentsForCourse(courseId)
      setAssignments(courseAssignments)

      const group = getStudentGroupForCourse(courseId, user.id)
      setStudentGroup(group)
    }
  }, [courseId, user, dataVersion])

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Course not found.</p>
        <Link to="/student/dashboard" className="text-indigo-600 mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  const evaluatedAssignments = assignments.map((assignment) => {
    const evaluation = evaluateStudentAssignmentStatus(assignment, user.id)
    return {
      ...assignment,
      evaluation,
    }
  })

  const filteredAssignments = evaluatedAssignments.filter((item) => {
    const matchesSearch =
      searchTerm.trim() === '' ||
      item.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase().trim())

    const matchesStatus =
      statusFilter === 'ALL' || item.evaluation.status === statusFilter

    return matchesSearch && matchesStatus
  })

  function getStatusBadge(status) {
    switch (status) {
      case ACKNOWLEDGEMENT_STATUS.SUBMITTED:
        return (
          <Badge variant="success" size="sm" icon={CheckCircle2}>
            Submitted
          </Badge>
        )
      case ACKNOWLEDGEMENT_STATUS.OVERDUE:
        return (
          <Badge variant="danger" size="sm" icon={XCircle}>
            Overdue
          </Badge>
        )
      case ACKNOWLEDGEMENT_STATUS.PENDING:
      default:
        return (
          <Badge variant="warning" size="sm" icon={Clock}>
            Pending
          </Badge>
        )
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <Link
            to="/student/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Enrolled Courses
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 break-words">
              {course.code}: {course.title}
            </h1>
            <Badge variant="purple" size="md">
              {course.term}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Review instructions, access OneDrive repository specifications, and record completion acknowledgements.
          </p>
        </div>

        <Link to={`/student/courses/${course.id}/groups`} className="w-full sm:w-auto">
          <Button variant="secondary" icon={Users} className="w-full sm:w-auto">
            {studentGroup
              ? `Group: ${studentGroup.name}`
              : 'Browse Course Groups'}
          </Button>
        </Link>
      </div>

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="w-full sm:w-80">
          <Input
            placeholder="Search assignments..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2 w-full sm:w-64">
          <Filter className="h-4 w-4 text-slate-400 shrink-0 hidden sm:block" />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full"
            options={[
              { value: 'ALL', label: 'All Statuses' },
              {
                value: ACKNOWLEDGEMENT_STATUS.PENDING,
                label: 'Pending Submissions',
              },
              {
                value: ACKNOWLEDGEMENT_STATUS.SUBMITTED,
                label: 'Submitted & Acknowledged',
              },
              {
                value: ACKNOWLEDGEMENT_STATUS.OVERDUE,
                label: 'Overdue Assignments',
              },
            ]}
          />
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description="There are currently no assignments matching your chosen filters."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment) => {
            const isGroup = assignment.submissionType === SUBMISSION_TYPES.GROUP
            const { evaluation } = assignment
            const remainingTime = getRemainingTimeText(assignment.deadline)

            return (
              <Card key={assignment.id} className="flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <div className="flex items-center gap-2">
                        <Badge
                          variant={isGroup ? 'purple' : 'neutral'}
                          size="sm"
                          icon={isGroup ? Users : null}
                        >
                          {isGroup ? 'Group Task' : 'Individual'}
                        </Badge>
                        {getStatusBadge(evaluation.status)}
                      </div>
                      <span className="text-xs font-medium text-slate-500">
                        {remainingTime}
                      </span>
                    </div>

                    <CardTitle className="text-base line-clamp-1">
                      {assignment.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-xs text-slate-600 line-clamp-3 leading-relaxed">
                      {assignment.description || 'No detailed instructions provided.'}
                    </p>

                    <div className="space-y-2 text-xs text-slate-500 border-t border-slate-100 pt-3">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-slate-400 shrink-0" />
                        <span>Deadline: {formatDateTime(assignment.deadline)}</span>
                      </div>

                      {assignment.oneDriveUrl && (
                        <div className="flex items-center gap-2">
                          <ExternalLink className="h-4 w-4 text-indigo-500 shrink-0" />
                          <a
                            href={assignment.oneDriveUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-indigo-600 hover:text-indigo-800 hover:underline truncate"
                          >
                            OneDrive Submission Destination
                          </a>
                        </div>
                      )}
                    </div>

                    {evaluation.isAcknowledged && (
                      <div className="rounded-lg bg-emerald-50/80 p-3.5 border border-emerald-200 text-xs text-emerald-900 space-y-1">
                        <div className="flex items-center gap-1.5 font-bold text-emerald-800">
                          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                          <span>Yes, I have submitted</span>
                        </div>
                        {isGroup ? (
                          <div className="text-emerald-700">
                            Acknowledged by <strong>{evaluation.acknowledgedByName}</strong> on {formatDateTime(evaluation.acknowledgedAt)}
                          </div>
                        ) : (
                          <div className="text-emerald-700">
                            Acknowledged on {formatDateTime(evaluation.acknowledgedAt)}
                          </div>
                        )}
                      </div>
                    )}

                    {!evaluation.isAcknowledged && evaluation.reason && (
                      <div className="rounded-lg bg-amber-50/80 p-3 text-xs text-amber-900 border border-amber-200 leading-relaxed font-medium">
                        {evaluation.reason}
                      </div>
                    )}
                  </CardContent>
                </div>

                <CardFooter className="pt-4">
                  {evaluation.isAcknowledged ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="w-full text-emerald-700 border-emerald-200 bg-emerald-50/50"
                    >
                      Completed & Acknowledged ✓
                    </Button>
                  ) : evaluation.status === ACKNOWLEDGEMENT_STATUS.OVERDUE ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="w-full text-rose-500 border-rose-200 bg-rose-50/30"
                    >
                      Deadline Passed
                    </Button>
                  ) : isGroup && !evaluation.hasGroup ? (
                    <Link
                      to={`/student/courses/${course.id}/groups`}
                      className="w-full"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full"
                        icon={Users}
                      >
                        Create or Join Group
                      </Button>
                    </Link>
                  ) : isGroup && !evaluation.isGroupLeader ? (
                    <Button
                      variant="secondary"
                      size="sm"
                      disabled
                      className="w-full"
                    >
                      Leader Action Required
                    </Button>
                  ) : (
                    <Button
                      variant="primary"
                      size="sm"
                      icon={CheckCircle2}
                      className="w-full text-xs sm:text-sm"
                      onClick={() => setSelectedAssignmentForAck(assignment)}
                    >
                      {isGroup ? 'Acknowledge for Group' : 'Yes, I have submitted'}
                    </Button>
                  )}
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      <AcknowledgeModal
        isOpen={Boolean(selectedAssignmentForAck)}
        onClose={() => setSelectedAssignmentForAck(null)}
        assignment={selectedAssignmentForAck}
        studentGroup={studentGroup}
      />
    </div>
  )
}
