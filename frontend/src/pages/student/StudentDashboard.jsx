import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Clock,
  Search,
  Users,
} from 'lucide-react'
import { StatCard } from '../../components/layout/StatCard'
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
import { ACKNOWLEDGEMENT_STATUS } from '../../constants/assignmentStatuses'
import { useAuth } from '../../hooks/useAuth'
import { useCourseData } from '../../hooks/useCourseData'
import { evaluateStudentAssignmentStatus } from '../../services/acknowledgementService'
import { getAllAssignments } from '../../services/assignmentService'
import { getUserById } from '../../services/authService'
import { getCoursesForStudent } from '../../services/courseService'
import { getStudentGroupForCourse } from '../../services/groupService'

export function StudentDashboard() {
  const { user } = useAuth()
  const { dataVersion } = useCourseData()

  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [assignments, setAssignments] = useState([])

  useEffect(() => {
    if (user?.id) {
      const studentCourses = getCoursesForStudent(user.id)
      setCourses(studentCourses)
      setAssignments(getAllAssignments())
    }
  }, [user, dataVersion])

  const enrolledCourseIds = new Set(courses.map((course) => course.id))
  const enrolledAssignments = assignments.filter((item) =>
    enrolledCourseIds.has(item.courseId)
  )

  let completedCount = 0
  let pendingCount = 0
  let overdueCount = 0

  enrolledAssignments.forEach((assignment) => {
    const statusResult = evaluateStudentAssignmentStatus(assignment, user.id)
    if (statusResult.status === ACKNOWLEDGEMENT_STATUS.SUBMITTED) {
      completedCount++
    } else if (statusResult.status === ACKNOWLEDGEMENT_STATUS.OVERDUE) {
      overdueCount++
    } else {
      pendingCount++
    }
  })

  const filteredCourses = courses.filter((course) => {
    const query = searchTerm.toLowerCase().trim()
    if (!query) return true
    return (
      course.title.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query)
    )
  })

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Access course assignments, collaborate with student project groups, and submit work acknowledgements.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <StatCard
          title="Enrolled Courses"
          value={courses.length}
          subtitle="Spring 2026 semester"
          icon={BookOpen}
        />
        <StatCard
          title="Pending Submissions"
          value={pendingCount}
          subtitle="Awaiting acknowledgement"
          icon={Clock}
        />
        <StatCard
          title="Completed"
          value={completedCount}
          subtitle="Acknowledged deliverables"
          icon={CheckCircle2}
        />
        <StatCard
          title="Overdue"
          value={overdueCount}
          subtitle="Deadlines expired"
          icon={Clock}
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Enrolled Courses ({courses.length})
            </h2>
            <p className="text-xs text-slate-500">
              Click into any course to view active assignments, OneDrive specs, and peer groups.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <Input
              placeholder="Search enrolled courses..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <EmptyState
            title="No enrolled courses found"
            description="No courses match your search filter."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseAssignments = enrolledAssignments.filter(
                (item) => item.courseId === course.id
              )
              const professor = getUserById(course.professorId)
              const myGroup = getStudentGroupForCourse(course.id, user.id)

              return (
                <Card key={course.id} hover className="flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="purple" size="md">
                          {course.code}
                        </Badge>
                        <span className="text-xs font-medium text-slate-400">
                          {course.term}
                        </span>
                      </div>
                      <CardTitle className="text-base line-clamp-1">
                        {course.title}
                      </CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="space-y-1.5 pt-2 border-t border-slate-100 text-xs text-slate-600">
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Instructor:</span>
                          <span className="font-medium text-slate-700">
                            {professor?.name || 'Faculty Member'}
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Assignments:</span>
                          <span className="font-semibold text-slate-800">
                            {courseAssignments.length} total
                          </span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="text-slate-400">Your Group:</span>
                          <span
                            className={
                              myGroup
                                ? 'font-semibold text-indigo-600'
                                : 'text-slate-400 italic'
                            }
                          >
                            {myGroup ? myGroup.name : 'Not in group'}
                          </span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter className="gap-2">
                    <Link
                      to={`/student/courses/${course.id}/groups`}
                      className="flex-1"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full text-xs"
                        icon={Users}
                      >
                        Groups
                      </Button>
                    </Link>
                    <Link
                      to={`/student/courses/${course.id}`}
                      className="flex-1"
                    >
                      <Button
                        variant="primary"
                        size="sm"
                        className="w-full text-xs justify-between group"
                      >
                        <span>Assignments</span>
                        <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
                      </Button>
                    </Link>
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

