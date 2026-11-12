import { useState } from 'react'
import { CheckCircle2, Clock, Search, XCircle } from 'lucide-react'
import { Badge } from '../../components/ui/Badge'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { ProgressBar } from '../../components/ui/ProgressBar'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '../../components/ui/Table'
import { ACKNOWLEDGEMENT_STATUS } from '../../constants/assignmentStatuses'
import { SUBMISSION_TYPES } from '../../constants/submissionTypes'
import { getAssignmentSubmissionStats } from '../../services/assignmentService'
import { formatDateTime } from '../../utils/dateTime'

export function AssignmentSubmissionsModal({ isOpen, onClose, assignment }) {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')

  if (!isOpen || !assignment) return null

  const stats = getAssignmentSubmissionStats(assignment.id)
  const isIndividual = assignment.submissionType === SUBMISSION_TYPES.INDIVIDUAL

  const filteredRecords = stats.records.filter((record) => {
    const query = searchTerm.toLowerCase().trim()
    const matchesSearch =
      !query ||
      record.name.toLowerCase().includes(query) ||
      (record.email && record.email.toLowerCase().includes(query)) ||
      (record.leaderName && record.leaderName.toLowerCase().includes(query))

    let matchesStatus = true
    if (statusFilter === 'SUBMITTED') {
      matchesStatus = record.status === ACKNOWLEDGEMENT_STATUS.SUBMITTED
    } else if (statusFilter === 'NOT_SUBMITTED') {
      matchesStatus = record.status !== ACKNOWLEDGEMENT_STATUS.SUBMITTED
    }

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
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={assignment.title}
      description={`${isIndividual ? 'Individual' : 'Group'} Submission Status & Acknowledgement Log`}
      maxWidth="max-w-3xl"
    >
      <div className="space-y-6">
        <div className="rounded-xl border border-slate-200 bg-slate-50/70 p-4">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 mb-3">
            <div>
              <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                Overall Submission Completion
              </span>
              <p className="text-sm font-semibold text-slate-900">
                {stats.submitted} of {stats.total} {isIndividual ? 'Students' : 'Groups'} Completed
              </p>
            </div>
            <div className="text-right">
              <span className="text-xs text-slate-500">Pending / Unsubmitted:</span>
              <span className="ml-1.5 text-xs font-bold text-slate-800">
                {stats.pending}
              </span>
            </div>
          </div>
          <ProgressBar
            percentage={stats.percentage}
            submitted={stats.submitted}
            total={stats.total}
          />
        </div>

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div className="grid grid-cols-3 sm:flex sm:items-center gap-1.5 bg-slate-100 p-1 rounded-xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('ALL')}
              className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center truncate ${
                statusFilter === 'ALL'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              All ({stats.total})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('SUBMITTED')}
              className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center truncate ${
                statusFilter === 'SUBMITTED'
                  ? 'bg-white text-emerald-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Submitted ({stats.submitted})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('NOT_SUBMITTED')}
              className={`px-2 sm:px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer text-center truncate ${
                statusFilter === 'NOT_SUBMITTED'
                  ? 'bg-white text-amber-700 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Pending ({stats.pending})
            </button>
          </div>

          <div className="w-full sm:w-64">
            <Input
              placeholder={`Search ${isIndividual ? 'student name or email' : 'group name'}...`}
              icon={Search}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredRecords.length === 0 ? (
          <div className="p-8 text-center text-sm text-slate-500 border rounded-xl">
            No matching submission records found for this filter.
          </div>
        ) : isIndividual ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Student Name</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acknowledged At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {record.name}
                  </TableCell>
                  <TableCell className="text-slate-500">{record.email}</TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {record.acknowledgedAt
                      ? formatDateTime(record.acknowledgedAt)
                      : 'Not submitted yet'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Group Name</TableHead>
                <TableHead>Leader</TableHead>
                <TableHead>Members</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Acknowledged By / At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell className="font-semibold text-slate-900">
                    {record.name}
                  </TableCell>
                  <TableCell className="text-slate-700 font-medium">
                    {record.leaderName}
                  </TableCell>
                  <TableCell className="text-slate-500">
                    {record.memberCount} members
                  </TableCell>
                  <TableCell>{getStatusBadge(record.status)}</TableCell>
                  <TableCell className="text-xs text-slate-600">
                    {record.acknowledgedAt ? (
                      <div>
                        <span className="font-medium text-slate-800">
                          {record.acknowledgedByName}
                        </span>
                        <div className="text-[11px] text-slate-400">
                          {formatDateTime(record.acknowledgedAt)}
                        </div>
                      </div>
                    ) : (
                      'Not submitted yet'
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </Modal>
  )
}
