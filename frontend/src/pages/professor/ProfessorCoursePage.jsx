import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Calendar,
  Clock,
  Edit3,
  ExternalLink,
  Eye,
  Filter,
  Plus,
  Search,
  Trash2,
  Users,
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
import { ConfirmDialog } from '../../components/ui/ConfirmDialog'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { ProgressBar } from '../../components/ui/ProgressBar'
import { Select } from '../../components/ui/Select'
import { SUBMISSION_TYPES } from '../../constants/submissionTypes'
import { useCourseData } from '../../hooks/useCourseData'
import {
  deleteAssignment,
  getAssignmentsForCourse,
  getAssignmentSubmissionStats,
} from '../../services/assignmentService'
import { getCourseById } from '../../services/courseService'
import {
  formatDateTime,
  getRemainingTimeText,
  isPastDeadline,
} from '../../utils/dateTime'
import { AssignmentFormModal } from './AssignmentFormModal'
import { AssignmentSubmissionsModal } from './AssignmentSubmissionsModal'

export function ProfessorCoursePage() {
  const { courseId } = useParams()
  const { dataVersion, triggerDataRefresh } = useCourseData()

  const [course, setCourse] = useState(null)
  const [assignments, setAssignments] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [typeFilter, setTypeFilter] = useState('ALL')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [sortBy, setSortBy] = useState('DEADLINE_ASC')

  const [isFormModalOpen, setIsFormModalOpen] = useState(false)
  const [assignmentToEdit, setAssignmentToEdit] = useState(null)
  const [selectedAssignmentForSubmissions, setSelectedAssignmentForSubmissions] =
    useState(null)
  const [assignmentToDelete, setAssignmentToDelete] = useState(null)

  useEffect(() => {
    if (courseId) {
      const foundCourse = getCourseById(courseId)
      setCourse(foundCourse)
      setAssignments(getAssignmentsForCourse(courseId))
    }
  }, [courseId, dataVersion])

  if (!course) {
    return (
      <div className="p-8 text-center">
        <p className="text-slate-500">Course not found.</p>
        <Link to="/professor/dashboard" className="text-indigo-600 mt-2 inline-block">
          Return to Dashboard
        </Link>
      </div>
    )
  }

  const filteredAssignments = assignments
    .filter((assignment) => {
      const matchesSearch =
        searchTerm.trim() === '' ||
        assignment.title.toLowerCase().includes(searchTerm.toLowerCase().trim()) ||
        assignment.description.toLowerCase().includes(searchTerm.toLowerCase().trim())

      const matchesType =
        typeFilter === 'ALL' || assignment.submissionType === typeFilter

      const isOverdue = isPastDeadline(assignment.deadline)
      const matchesStatus =
        statusFilter === 'ALL' ||
        (statusFilter === 'OVERDUE' && isOverdue) ||
        (statusFilter === 'ACTIVE' && !isOverdue)

      return matchesSearch && matchesType && matchesStatus
    })
    .sort((a, b) => {
      const timeA = new Date(a.deadline).getTime()
      const timeB = new Date(b.deadline).getTime()
      if (sortBy === 'DEADLINE_DESC') {
        return timeB - timeA
      }
      return timeA - timeB
    })

  function handleOpenCreate() {
    setAssignmentToEdit(null)
    setIsFormModalOpen(true)
  }

  function handleOpenEdit(assignment) {
    setAssignmentToEdit(assignment)
    setIsFormModalOpen(true)
  }

  function handleOpenSubmissions(assignment) {
    setSelectedAssignmentForSubmissions(assignment)
  }

  function handleDeleteClick(assignment) {
    setAssignmentToDelete(assignment)
  }

  function handleConfirmDelete() {
    if (!assignmentToDelete) return
    try {
      deleteAssignment(assignmentToDelete.id)
      toast.success('Assignment deleted successfully.')
      setAssignmentToDelete(null)
      triggerDataRefresh()
    } catch {
      toast.error('Failed to delete assignment.')
    }
  }

  function handleFormSuccess() {
    triggerDataRefresh()
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200 pb-5">
        <div className="space-y-1">
          <Link
            to="/professor/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Courses
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 break-words">
              {course.code}: {course.title}
            </h1>
            <Badge variant="primary" size="md">
              {course.term}
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            {course.enrolledStudentIds?.length || 0} enrolled students • {assignments.length} published assignments
          </p>
        </div>

        <Button
          onClick={handleOpenCreate}
          icon={Plus}
          variant="primary"
          size="md"
          className="w-full sm:w-auto"
        >
          Create Assignment
        </Button>
      </div>

      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 bg-white p-4 rounded-xl border border-slate-200/80 shadow-xs">
        <div className="w-full lg:w-72">
          <Input
            placeholder="Search assignments..."
            icon={Search}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 lg:flex lg:items-center gap-2.5 w-full lg:w-auto">
          <div className="hidden lg:flex items-center text-slate-400 pl-1">
            <Filter className="h-4 w-4" />
          </div>
          <div className="w-full lg:w-44">
            <Select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Modalities' },
                {
                  value: SUBMISSION_TYPES.INDIVIDUAL,
                  label: 'Individual Only',
                },
                {
                  value: SUBMISSION_TYPES.GROUP,
                  label: 'Group Only',
                },
              ]}
            />
          </div>

          <div className="w-full lg:w-44">
            <Select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              options={[
                { value: 'ALL', label: 'All Statuses' },
                { value: 'ACTIVE', label: 'Active Deadlines' },
                { value: 'OVERDUE', label: 'Overdue Only' },
              ]}
            />
          </div>

          <div className="w-full lg:w-56">
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              options={[
                { value: 'DEADLINE_ASC', label: 'Deadline (Earliest First)' },
                { value: 'DEADLINE_DESC', label: 'Deadline (Latest First)' },
              ]}
            />
          </div>
        </div>
      </div>

      {filteredAssignments.length === 0 ? (
        <EmptyState
          title="No assignments found"
          description={
            assignments.length === 0
              ? 'Get started by creating your first course assignment.'
              : 'No assignments match the selected filters.'
          }
          action={
            assignments.length === 0 ? (
              <Button onClick={handleOpenCreate} icon={Plus}>
                Create First Assignment
              </Button>
            ) : null
          }
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAssignments.map((assignment) => {
            const stats = getAssignmentSubmissionStats(assignment.id)
            const isOverdue = isPastDeadline(assignment.deadline)
            const remainingTime = getRemainingTimeText(assignment.deadline)
            const isGroup = assignment.submissionType === SUBMISSION_TYPES.GROUP

            return (
              <Card key={assignment.id} className="flex flex-col justify-between">
                <div>
                  <CardHeader>
                    <div className="flex items-start justify-between gap-2 mb-2">
                      <Badge
                        variant={isGroup ? 'purple' : 'neutral'}
                        size="sm"
                        icon={isGroup ? Users : null}
                      >
                        {isGroup ? 'Group Task' : 'Individual'}
                      </Badge>
                      <Badge
                        variant={isOverdue ? 'danger' : 'success'}
                        size="sm"
                        icon={Clock}
                      >
                        {remainingTime}
                      </Badge>
                    </div>
                    <CardTitle className="text-base line-clamp-1">
                      {assignment.title}
                    </CardTitle>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {assignment.description || 'No description provided.'}
                    </p>

                    <div className="space-y-2 text-xs text-slate-500">
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
                            OneDrive Submission / Specs
                          </a>
                        </div>
                      )}
                    </div>

                    <div className="rounded-lg bg-slate-50 p-3 border border-slate-100">
                      <ProgressBar
                        percentage={stats.percentage}
                        submitted={stats.submitted}
                        total={stats.total}
                      />
                    </div>
                  </CardContent>
                </div>

                <CardFooter className="gap-2">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="secondary"
                      size="sm"
                      icon={Edit3}
                      onClick={() => handleOpenEdit(assignment)}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="primary"
                      size="sm"
                      icon={Eye}
                      onClick={() => handleOpenSubmissions(assignment)}
                    >
                      Submissions
                    </Button>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    icon={Trash2}
                    onClick={() => handleDeleteClick(assignment)}
                    className="text-slate-400 hover:text-rose-600 hover:bg-rose-50"
                    aria-label="Delete assignment"
                  >
                    Delete
                  </Button>
                </CardFooter>
              </Card>
            )
          })}
        </div>
      )}

      <AssignmentFormModal
        isOpen={isFormModalOpen}
        onClose={() => setIsFormModalOpen(false)}
        courseId={course.id}
        assignmentToEdit={assignmentToEdit}
        onSuccess={handleFormSuccess}
      />

      <AssignmentSubmissionsModal
        isOpen={Boolean(selectedAssignmentForSubmissions)}
        onClose={() => setSelectedAssignmentForSubmissions(null)}
        assignment={selectedAssignmentForSubmissions}
      />

      <ConfirmDialog
        isOpen={Boolean(assignmentToDelete)}
        onClose={() => setAssignmentToDelete(null)}
        onConfirm={handleConfirmDelete}
        title="Delete Assignment"
        message={`Are you sure you want to delete "${assignmentToDelete?.title}"? This action cannot be undone and will remove all submission records associated with it.`}
        confirmText="Delete Assignment"
        cancelText="Cancel"
        variant="danger"
      />
    </div>
  )
}
