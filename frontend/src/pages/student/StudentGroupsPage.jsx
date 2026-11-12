import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import {
  ArrowLeft,
  Crown,
  Plus,
  ShieldCheck,
  UserCheck,
  UserPlus,
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
import { EmptyState } from '../../components/ui/EmptyState'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { useAuth } from '../../hooks/useAuth'
import { useCourseData } from '../../hooks/useCourseData'
import { getCourseById } from '../../services/courseService'
import {
  createGroup,
  getGroupsForCourse,
  getHydratedGroup,
  getStudentGroupForCourse,
  joinGroup,
} from '../../services/groupService'
import { formatDate } from '../../utils/dateTime'

export function StudentGroupsPage() {
  const { courseId } = useParams()
  const { user } = useAuth()
  const { dataVersion, triggerDataRefresh } = useCourseData()

  const [course, setCourse] = useState(null)
  const [courseGroups, setCourseGroups] = useState([])
  const [userGroup, setUserGroup] = useState(null)

  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false)
  const [newGroupName, setNewGroupName] = useState('')
  const [createError, setCreateError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (courseId && user?.id) {
      const foundCourse = getCourseById(courseId)
      setCourse(foundCourse)

      const rawGroups = getGroupsForCourse(courseId)
      const hydrated = rawGroups.map(getHydratedGroup)
      setCourseGroups(hydrated)

      const myGroup = getStudentGroupForCourse(courseId, user.id)
      setUserGroup(myGroup ? getHydratedGroup(myGroup) : null)
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

  const isUserInGroup = Boolean(userGroup)
  const isUserLeader = userGroup?.leaderId === user?.id

  function handleCreateGroup(event) {
    event.preventDefault()
    if (!newGroupName.trim()) {
      setCreateError('Group name is required.')
      return
    }

    setIsSubmitting(true)
    try {
      createGroup({
        courseId,
        name: newGroupName,
        creatorStudentId: user.id,
      })
      toast.success(`Group "${newGroupName}" created! You are now the group leader.`)
      setNewGroupName('')
      setIsCreateModalOpen(false)
      triggerDataRefresh()
    } catch (error) {
      toast.error(error.message || 'Failed to create group.')
      setCreateError(error.message)
    } finally {
      setIsSubmitting(false)
    }
  }

  function handleJoinGroup(group) {
    try {
      joinGroup({
        groupId: group.id,
        studentId: user.id,
      })
      toast.success(`You have joined "${group.name}"!`)
      triggerDataRefresh()
    } catch (error) {
      toast.error(error.message || 'Unable to join group.')
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div className="space-y-1">
          <Link
            to={`/student/courses/${course.id}`}
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-indigo-600 transition-colors"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Course Assignments
          </Link>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 break-words">
              {course.code} Project Groups
            </h1>
            <Badge variant="purple" size="md">
              Group Management
            </Badge>
          </div>
          <p className="text-xs text-slate-500">
            Collaborate with peers. Only group leaders can submit group assignment acknowledgements.
          </p>
        </div>

        {!isUserInGroup && (
          <Button
            onClick={() => {
              setCreateError('')
              setIsCreateModalOpen(true)
            }}
            icon={Plus}
            variant="primary"
            className="w-full sm:w-auto"
          >
            Create New Group
          </Button>
        )}
      </div>

      {isUserInGroup ? (
        <div className="rounded-2xl border border-indigo-200/90 bg-gradient-to-r from-indigo-50/70 via-white to-indigo-50/40 p-6 shadow-xs">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-600">
                  Your Active Group in this Course
                </span>
                {isUserLeader && (
                  <Badge variant="warning" size="sm" icon={Crown}>
                    Group Leader
                  </Badge>
                )}
              </div>
              <h2 className="text-xl font-bold text-slate-900">
                {userGroup.name}
              </h2>
              <p className="text-xs text-slate-500">
                Formed on {formatDate(userGroup.createdAt)} • Leader:{' '}
                <span className="font-semibold text-slate-700">
                  {userGroup.leader?.name}
                </span>
              </p>
            </div>
            <div className="flex items-center gap-2 text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1.5 rounded-xl border border-emerald-200 shadow-3xs">
              <ShieldCheck className="h-4 w-4" />
              <span>Course Group Enrolled</span>
            </div>
          </div>

          <div className="mt-5 border-t border-indigo-100/90 pt-4">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
              Team Members ({userGroup.members.length})
            </span>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {userGroup.members.map((member) => (
                <div
                  key={member.id}
                  className="flex items-center gap-2.5 rounded-xl border border-slate-200/80 bg-white p-3 shadow-3xs"
                >
                  <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-slate-100 text-slate-700 font-bold text-xs">
                    {member.name.charAt(0)}
                  </div>
                  <div className="flex flex-col text-left truncate">
                    <span className="text-xs font-bold text-slate-900 truncate">
                      {member.name}
                      {member.id === userGroup.leaderId && ' 👑'}
                      {member.id === user.id && ' (You)'}
                    </span>
                    <span className="text-[11px] text-slate-400 truncate font-medium">
                      {member.email}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <div className="rounded-2xl border border-amber-200 bg-amber-50/70 p-5 shadow-3xs">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="space-y-1">
              <h3 className="text-sm font-bold text-amber-900">
                You do not belong to a group for this course yet
              </h3>
              <p className="text-xs text-amber-800 leading-relaxed font-medium">
                You must either create a new group or join an existing peer team to submit group assignments.
              </p>
            </div>
            <Button
              size="sm"
              variant="primary"
              icon={Plus}
              onClick={() => {
                setCreateError('')
                setIsCreateModalOpen(true)
              }}
            >
              Create Group Now
            </Button>
          </div>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-bold text-slate-900">
            Course Groups ({courseGroups.length})
          </h3>
          <p className="text-xs text-slate-500">
            Browse all established student teams in {course.code}.
          </p>
        </div>

        {courseGroups.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No groups formed yet"
            description="Be the first to create a student team in this course!"
            action={
              <Button
                onClick={() => {
                  setCreateError('')
                  setIsCreateModalOpen(true)
                }}
                icon={Plus}
              >
                Create Group
              </Button>
            }
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courseGroups.map((group) => {
              const isCurrentGroup = group.id === userGroup?.id
              const isMember = group.memberIds.includes(user.id)

              return (
                <Card
                  key={group.id}
                  className={`flex flex-col justify-between ${
                    isCurrentGroup ? 'ring-2 ring-indigo-500 border-indigo-300' : ''
                  }`}
                >
                  <div>
                    <CardHeader>
                      <div className="flex items-center justify-between mb-1.5">
                        <Badge variant="purple" size="sm" icon={Users}>
                          {group.members.length} {group.members.length === 1 ? 'member' : 'members'}
                        </Badge>
                        {isCurrentGroup && (
                          <Badge variant="success" size="sm" icon={UserCheck}>
                            Your Team
                          </Badge>
                        )}
                      </div>
                      <CardTitle className="text-base">{group.name}</CardTitle>
                    </CardHeader>

                    <CardContent className="space-y-3">
                      <div className="text-xs text-slate-500">
                        <span className="font-semibold text-slate-700">Leader:</span>{' '}
                        {group.leader?.name || 'Unknown'}
                      </div>

                      <div className="rounded-xl bg-slate-50/80 p-2.5 border border-slate-100">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block mb-1">
                          Members
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {group.members.map((member) => (
                            <span
                              key={member.id}
                              className="inline-block rounded-lg bg-white px-2 py-0.5 text-[11px] font-semibold text-slate-700 border border-slate-200/80 shadow-3xs"
                            >
                              {member.name}
                              {member.id === group.leaderId ? ' 👑' : ''}
                            </span>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </div>

                  <CardFooter>
                    {isMember ? (
                      <span className="text-xs font-bold text-indigo-600">
                        Active Member
                      </span>
                    ) : isUserInGroup ? (
                      <span className="text-xs text-slate-400 font-medium">
                        Already in a team
                      </span>
                    ) : (
                      <Button
                        variant="secondary"
                        size="sm"
                        icon={UserPlus}
                        onClick={() => handleJoinGroup(group)}
                        className="w-full"
                      >
                        Join Group
                      </Button>
                    )}
                  </CardFooter>
                </Card>
              )
            })}
          </div>
        )}
      </div>

      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        title="Create Course Group"
        description={`Found a new team for ${course.code}. You will automatically become the group leader.`}
      >
        <form onSubmit={handleCreateGroup} className="space-y-4">
          {createError && (
            <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
              {createError}
            </div>
          )}

          <Input
            label="Group Name"
            required
            icon={Users}
            placeholder="e.g. Distributed Pioneers"
            value={newGroupName}
            onChange={(e) => {
              setNewGroupName(e.target.value)
              setCreateError('')
            }}
          />

          <div className="rounded-xl bg-indigo-50/70 p-3.5 text-xs text-indigo-900 border border-indigo-100 leading-relaxed">
            <strong>Group Leader Privileges:</strong> As the creator, only you will possess authority to submit and acknowledge group assignments on behalf of all peers who join your team.
          </div>

          <div className="flex flex-col-reverse sm:flex-row w-full sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-3 border-t border-slate-100">
            <Button
              type="button"
              variant="secondary"
              onClick={() => setIsCreateModalOpen(false)}
              disabled={isSubmitting}
              className="w-full sm:w-auto"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              isLoading={isSubmitting}
              className="w-full sm:w-auto"
            >
              Establish Group
            </Button>
          </div>
        </form>
      </Modal>
    </div>
  )
}
