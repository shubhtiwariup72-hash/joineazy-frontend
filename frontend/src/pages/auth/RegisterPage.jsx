import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { BookOpen, Building, GraduationCap, Lock, Mail, User } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ROLES } from '../../constants/roles'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { validateEmail, validatePassword, validateRequired } from '../../utils/validation'

export function RegisterPage() {
  const navigate = useNavigate()
  const { register } = useAuth()

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    role: ROLES.STUDENT,
    department: '',
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  function handleChange(event) {
    const { name, value } = event.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }))
    }
  }

  function handleRoleChange(selectedRole) {
    setFormData((prev) => ({ ...prev, role: selectedRole }))
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const nameError = validateRequired(formData.name, 'Full name')
    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
      })
      return
    }

    setIsLoading(true)
    try {
      const createdUser = await register({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        role: formData.role,
        department: formData.department,
      })
      toast.success(`Account created! Welcome, ${createdUser.name}`)

      if (createdUser.role === ROLES.PROFESSOR) {
        navigate(ROUTES.PROFESSOR_DASHBOARD, { replace: true })
      } else {
        navigate(ROUTES.STUDENT_DASHBOARD, { replace: true })
      }
    } catch (error) {
      toast.error(error.message || 'Registration failed.')
      setErrors({ form: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Create an account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Select your institutional role to set up your profile.
        </p>
      </div>

      <div className="space-y-1.5">
        <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">
          Select Your Role <span className="text-rose-500">*</span>
        </label>
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => handleRoleChange(ROLES.STUDENT)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
              formData.role === ROLES.STUDENT
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-xs ring-2 ring-indigo-500/10'
                : 'border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 shadow-3xs'
            }`}
          >
            <BookOpen className="h-5 w-5" />
            <span className="text-xs font-bold">Student</span>
          </button>
          <button
            type="button"
            onClick={() => handleRoleChange(ROLES.PROFESSOR)}
            className={`flex flex-col items-center gap-2 rounded-2xl border p-3.5 text-center transition-all cursor-pointer ${
              formData.role === ROLES.PROFESSOR
                ? 'border-indigo-600 bg-indigo-50/70 text-indigo-700 shadow-xs ring-2 ring-indigo-500/10'
                : 'border-slate-200/90 bg-white text-slate-600 hover:border-slate-300 shadow-3xs'
            }`}
          >
            <GraduationCap className="h-5 w-5" />
            <span className="text-xs font-bold">Professor</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3.5">
        {errors.form && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
            {errors.form}
          </div>
        )}

        <Input
          label="Full Name"
          name="name"
          type="text"
          required
          icon={User}
          placeholder="e.g. Dr. Alex Morgan"
          value={formData.name}
          onChange={handleChange}
          error={errors.name}
        />

        <Input
          label="Email address"
          name="email"
          type="email"
          required
          icon={Mail}
          placeholder="name@university.edu"
          value={formData.email}
          onChange={handleChange}
          error={errors.email}
        />

        <Input
          label="Password"
          name="password"
          type="password"
          required
          icon={Lock}
          placeholder="Minimum 6 characters"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Input
          label="Department / Program"
          name="department"
          type="text"
          icon={Building}
          placeholder="e.g. Computer Science & Engineering"
          value={formData.department}
          onChange={handleChange}
        />

        <Button
          type="submit"
          className="w-full mt-2 shadow-sm"
          size="lg"
          isLoading={isLoading}
        >
          Complete Registration
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Already have an account?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Sign in
        </Link>
      </div>
    </div>
  )
}
