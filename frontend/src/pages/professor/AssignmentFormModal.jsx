import { useEffect, useState } from 'react'
import { toast } from 'react-hot-toast'
import { Calendar, FileText, Link2 } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { Modal } from '../../components/ui/Modal'
import { Select } from '../../components/ui/Select'
import { Textarea } from '../../components/ui/Textarea'
import { SUBMISSION_TYPES } from '../../constants/submissionTypes'
import {
  createAssignment,
  updateAssignment,
} from '../../services/assignmentService'
import { toInputDateTimeLocal } from '../../utils/dateTime'
import {
  validateFutureDate,
  validateRequired,
  validateUrl,
} from '../../utils/validation'

export function AssignmentFormModal({
  isOpen,
  onClose,
  courseId,
  assignmentToEdit = null,
  onSuccess,
}) {
  const isEditing = Boolean(assignmentToEdit)

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    deadline: '',
    oneDriveUrl: '',
    submissionType: SUBMISSION_TYPES.INDIVIDUAL,
  })
  const [errors, setErrors] = useState({})
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (assignmentToEdit) {
      setFormData({
        title: assignmentToEdit.title,
        description: assignmentToEdit.description || '',
        deadline: toInputDateTimeLocal(assignmentToEdit.deadline),
        oneDriveUrl: assignmentToEdit.oneDriveUrl || '',
        submissionType: assignmentToEdit.submissionType,
      })
    } else {
      setFormData({
        title: '',
        description: '',
        deadline: '',
        oneDriveUrl: '',
        submissionType: SUBMISSION_TYPES.INDIVIDUAL,
      })
    }
    setErrors({})
  }, [assignmentToEdit, isOpen])

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function handleSubmit(event) {
    event.preventDefault()

    const titleError = validateRequired(formData.title, 'Assignment title')
    const deadlineError = validateFutureDate(formData.deadline, 'Deadline')
    const urlError = formData.oneDriveUrl
      ? validateUrl(formData.oneDriveUrl, 'OneDrive URL')
      : ''

    if (titleError || deadlineError || urlError) {
      setErrors({
        title: titleError,
        deadline: deadlineError,
        oneDriveUrl: urlError,
      })
      return
    }

    setIsSubmitting(true)
    try {
      if (isEditing) {
        updateAssignment(assignmentToEdit.id, {
          title: formData.title,
          description: formData.description,
          deadline: formData.deadline,
          oneDriveUrl: formData.oneDriveUrl,
          submissionType: formData.submissionType,
        })
        toast.success('Assignment updated successfully.')
      } else {
        createAssignment({
          courseId,
          title: formData.title,
          description: formData.description,
          deadline: formData.deadline,
          oneDriveUrl: formData.oneDriveUrl,
          submissionType: formData.submissionType,
        })
        toast.success('Assignment created successfully.')
      }
      onSuccess?.()
      onClose()
    } catch (error) {
      toast.error(error.message || 'Failed to save assignment.')
      setErrors({ form: error.message })
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Assignment' : 'Create New Assignment'}
      description={
        isEditing
          ? 'Update the assignment parameters, deadline, or resource URL.'
          : 'Define instructions, deadlines, submission modality, and OneDrive links.'
      }
      maxWidth="max-w-xl"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="rounded-lg bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700">
            {errors.form}
          </div>
        )}

        <Input
          label="Assignment Title"
          name="title"
          required
          icon={FileText}
          placeholder="e.g. Distributed Consensus Protocol Specification"
          value={formData.title}
          onChange={handleChange}
          error={errors.title}
        />

        <Textarea
          label="Description & Instructions"
          name="description"
          rows={3}
          placeholder="Provide requirements, grading criteria, and specific submission expectations..."
          value={formData.description}
          onChange={handleChange}
        />

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <Input
            label="Deadline Date & Time"
            name="deadline"
            type="datetime-local"
            required
            icon={Calendar}
            value={formData.deadline}
            onChange={handleChange}
            error={errors.deadline}
          />

          <Select
            label="Submission Mode"
            name="submissionType"
            value={formData.submissionType}
            onChange={handleChange}
            options={[
              {
                value: SUBMISSION_TYPES.INDIVIDUAL,
                label: 'Individual Submission',
              },
              {
                value: SUBMISSION_TYPES.GROUP,
                label: 'Group Submission',
              },
            ]}
          />
        </div>

        <Input
          label="OneDrive Resource / Folder URL"
          name="oneDriveUrl"
          icon={Link2}
          placeholder="https://onedrive.live.com/view.aspx?..."
          value={formData.oneDriveUrl}
          onChange={handleChange}
          error={errors.oneDriveUrl}
          helperText="Direct OneDrive link where students view reference documents or deposit project files."
        />

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
            type="submit"
            variant="primary"
            isLoading={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isEditing ? 'Save Changes' : 'Create Assignment'}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
