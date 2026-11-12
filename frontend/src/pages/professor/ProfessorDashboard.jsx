import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, BookOpen, CheckSquare, Search, Users } from 'lucide-react'
import { StatCard } from '../../components/layout/StatCard'
import { Badge } from '../../components/ui/Badge'
import { Button } from '../../components/ui/Button'
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../components/ui/Card'
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { useAuth } from '../../hooks/useAuth'
import { useCourseData } from '../../hooks/useCourseData'
import { getAllAssignments } from '../../services/assignmentService'
import { getCoursesForProfessor } from '../../services/courseService'

export function ProfessorDashboard() {
  const { user } = useAuth()
  const { dataVersion } = useCourseData()

  const [courses, setCourses] = useState([])
  const [searchTerm, setSearchTerm] = useState('')
  const [allAssignments, setAllAssignments] = useState([])

  useEffect(() => {
    if (user?.id) {
      const professorCourses = getCoursesForProfessor(user.id)
      setCourses(professorCourses)
      setAllAssignments(getAllAssignments())
    }
  }, [user, dataVersion])

  const filteredCourses = courses.filter((course) => {
    const query = searchTerm.toLowerCase().trim()
    if (!query) return true
    return (
      course.title.toLowerCase().includes(query) ||
      course.code.toLowerCase().includes(query)
    )
  })

  const totalStudentsEnrolled = courses.reduce(
    (acc, curr) => acc + (curr.enrolledStudentIds?.length || 0),
    0
  )

  const professorAssignments = allAssignments.filter((assignment) =>
    courses.some((course) => course.id === assignment.courseId)
  )

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900 sm:text-3xl">
          Welcome back, {user?.name}
        </h1>
        <p className="mt-1 text-sm text-slate-500">
          Manage your assigned university courses, monitor assignment submissions, and review student progress.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        <StatCard
          title="Taught Courses"
          value={courses.length}
          subtitle="Active academic courses"
          icon={BookOpen}
        />
        <StatCard
          title="Published Assignments"
          value={professorAssignments.length}
          subtitle="Individual & group tasks"
          icon={CheckSquare}
        />
        <StatCard
          title="Total Student Enrollments"
          value={totalStudentsEnrolled}
          subtitle="Enrolled active students"
          icon={Users}
        />
      </div>

      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900">
              Assigned Courses ({courses.length})
            </h2>
            <p className="text-xs text-slate-500">
              Select a course to inspect assignments, track submissions, and publish new tasks.
            </p>
          </div>
          <div className="w-full sm:w-72">
            <Input
              placeholder="Filter by course code or title..."
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredCourses.length === 0 ? (
          <EmptyState
            title="No courses matched"
            description="No assigned courses match your search criteria."
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCourses.map((course) => {
              const courseAssignments = allAssignments.filter(
                (item) => item.courseId === course.id
              )
              const studentCount = course.enrolledStudentIds?.length || 0

              return (
                <Card key={course.id} hover className="flex flex-col justify-between">
                  <div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-2">
                        <Badge variant="primary" size="md">
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
                    <CardContent>
                      <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                        {course.description}
                      </p>

                      <div className="grid grid-cols-2 gap-3 pt-3 mt-3 border-t border-slate-100">
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <Users className="h-4 w-4 text-slate-400" />
                          <span>{studentCount} Students</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-600">
                          <CheckSquare className="h-4 w-4 text-slate-400" />
                          <span>{courseAssignments.length} Assignments</span>
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter>
                    <Link
                      to={`/professor/courses/${course.id}`}
                      className="w-full"
                    >
                      <Button
                        variant="secondary"
                        size="sm"
                        className="w-full justify-between group"
                      >
                        <span>Manage Assignments</span>
                        <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
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

