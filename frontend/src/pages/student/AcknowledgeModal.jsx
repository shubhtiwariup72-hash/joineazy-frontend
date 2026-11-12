import { useState } from 'react'
import { toast } from 'react-hot-toast'
import { CheckCircle2, ExternalLink, Users } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Modal } from '../../components/ui/Modal'
import { SUBMISSION_TYPES } from '../../constants/submissionTypes'
import { useAuth } from '../../hooks/useAuth'
import { useCourseData } from '../../hooks/useCourseData'
import {
  acknowledgeGroupAssignment,
  acknowledgeIndividualAssignment,
} from '../../services/acknowledgementService'

export function AcknowledgeModal({
  isOpen,
  onClose,
  assignment,
  studentGroup = null,
  onSuccess,
}) {
  const { user } = useAuth()
  const { triggerDataRefresh } = useCourseData()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [hasConfirmedDelivery, setHasConfirmedDelivery] = useState(false)

  if (!isOpen || !assignment) return null

  const isGroup = assignment.submissionType === SUBMISSION_TYPES.GROUP

  async function handleConfirmAcknowledgement() {
    if (!hasConfirmedDelivery) {
      toast.error('Please verify that you have uploaded your files.')
      return
    }

    setIsSubmitting(true)
    try {
      if (isGroup) {
        if (!studentGroup) {
          throw new Error('Group not found.')
        }
        acknowledgeGroupAssignment({
          assignmentId: assignment.id,
          groupId: studentGroup.id,
          leaderId: user.id,
          courseId: assignment.courseId,
        })
        toast.success(`Group assignment submitted on behalf of ${studentGroup.name}!`)
      } else {
        acknowledgeIndividualAssignment({
          assignmentId: assignment.id,
          studentId: user.id,
          courseId: assignment.courseId,
        })
        toast.success('Assignment submission acknowledged!')
      }

      triggerDataRefresh()
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error(error.message || 'Failed to record acknowledgement.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Acknowledge Assignment Submission"
      description={
        isGroup
          ? `Group Submission for: ${assignment.title}`
          : `Individual Submission for: ${assignment.title}`
      }
      maxWidth="max-w-lg"
    >
      <div className="space-y-4">
        {isGroup && studentGroup ? (
          <div className="rounded-xl border border-indigo-100 bg-indigo-50/60 p-4">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-indigo-700 mb-1">
              <Users className="h-4 w-4" />
              Group Leadership Confirmation
            </div>
            <p className="text-xs text-indigo-900 leading-relaxed">
              You are submitting as the group leader of <strong>{studentGroup.name}</strong>.
              This single submission will acknowledge and record completion for all group members simultaneously.
            </p>
          </div>
        ) : null}

        <div className="rounded-xl border border-slate-200 bg-slate-50 p-4 space-y-2 text-xs text-slate-600">
          <div className="font-semibold text-slate-800">Deliverable Verification:</div>
          <p>
            Ensure you have deposited all required reports, source code archives, or assets into the designated OneDrive destination prior to confirmation.
          </p>
          {assignment.oneDriveUrl && (
            <a
              href={assignment.oneDriveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-800 hover:underline pt-1"
            >
              Open OneDrive Submission Destination
              <ExternalLink className="h-3.5 w-3.5" />
            </a>
          )}
        </div>

        <label className="flex items-start gap-3 rounded-xl border border-slate-200 p-3.5 hover:bg-slate-50/80 cursor-pointer select-none">
          <input
            type="checkbox"
            checked={hasConfirmedDelivery}
            onChange={(e) => setHasConfirmedDelivery(e.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-slate-300 text-indigo-600 focus:ring-indigo-500"
          />
          <span className="text-xs text-slate-700 leading-normal">
            I certify that our academic work is fully finalized, uploaded to the OneDrive repository, and ready for evaluation.
          </span>
        </label>

        <div className="flex flex-col-reverse sm:flex-row w-full sm:items-center sm:justify-end gap-2.5 sm:gap-3 pt-4 border-t border-slate-100">
          <Button
            type="button"
            variant="secondary"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="success"
            icon={CheckCircle2}
            disabled={!hasConfirmedDelivery}
            isLoading={isSubmitting}
            onClick={handleConfirmAcknowledgement}
            className="w-full sm:w-auto"
          >
            Confirm & Acknowledge
          </Button>
        </div>
      </div>
    </Modal>
  )
}
