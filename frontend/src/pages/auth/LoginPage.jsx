import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { toast } from 'react-hot-toast'
import { Lock, Mail } from 'lucide-react'
import { Button } from '../../components/ui/Button'
import { Input } from '../../components/ui/Input'
import { ROLES } from '../../constants/roles'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { validateEmail, validatePassword } from '../../utils/validation'

const DEMO_PRESETS = [
  {
    role: 'Professor',
    email: 'professor@joineazy.edu',
    password: 'password123',
    target: ROLES.PROFESSOR,
  },
  {
    role: 'Student 1 (Leader)',
    email: 'student1@joineazy.edu',
    password: 'password123',
    target: ROLES.STUDENT,
  },
  {
    role: 'Student 2 (Member)',
    email: 'student2@joineazy.edu',
    password: 'password123',
    target: ROLES.STUDENT,
  },
  {
    role: 'Student 3 (Solo)',
    email: 'student3@joineazy.edu',
    password: 'password123',
    target: ROLES.STUDENT,
  },
]

export function LoginPage() {
  const navigate = useNavigate()
  const { login } = useAuth()

  const [formData, setFormData] = useState({
    email: '',
    password: '',
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

  function handleApplyPreset(preset) {
    setFormData({
      email: preset.email,
      password: preset.password,
    })
    setErrors({})
  }

  async function handleSubmit(event) {
    event.preventDefault()

    const emailError = validateEmail(formData.email)
    const passwordError = validatePassword(formData.password)

    if (emailError || passwordError) {
      setErrors({
        email: emailError,
        password: passwordError,
      })
      return
    }

    setIsLoading(true)
    try {
      const loggedUser = await login(formData.email, formData.password)
      toast.success(`Welcome back, ${loggedUser.name}!`)

      if (loggedUser.role === ROLES.PROFESSOR) {
        navigate(ROUTES.PROFESSOR_DASHBOARD, { replace: true })
      } else {
        navigate(ROUTES.STUDENT_DASHBOARD, { replace: true })
      }
    } catch (error) {
      toast.error(error.message || 'Login failed. Please check your credentials.')
      setErrors({ form: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Sign in to your account
        </h2>
        <p className="mt-1 text-xs text-slate-500">
          Enter your university credentials or click a demo account below.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200/80 bg-slate-50/80 p-3.5 shadow-3xs">
        <span className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 mb-2">
          Quick Demo Credentials
        </span>
        <div className="flex flex-wrap gap-1.5">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.email}
              type="button"
              onClick={() => handleApplyPreset(preset)}
              className="rounded-lg border border-slate-200/90 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 hover:border-indigo-400 hover:text-indigo-600 hover:bg-indigo-50/50 shadow-3xs transition-all cursor-pointer"
            >
              {preset.role}
            </button>
          ))}
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {errors.form && (
          <div className="rounded-xl bg-rose-50 border border-rose-200 p-3 text-xs text-rose-700 font-medium">
            {errors.form}
          </div>
        )}

        <Input
          label="Email address"
          name="email"
          type="email"
          autoComplete="email"
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
          autoComplete="current-password"
          required
          icon={Lock}
          placeholder="Enter your password"
          value={formData.password}
          onChange={handleChange}
          error={errors.password}
        />

        <Button
          type="submit"
          className="w-full shadow-sm"
          size="lg"
          isLoading={isLoading}
        >
          Sign In
        </Button>
      </form>

      <div className="text-center text-xs text-slate-500">
        Do not have an account yet?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-bold text-indigo-600 hover:text-indigo-700 hover:underline"
        >
          Create an account
        </Link>
      </div>
    </div>
  )
}
