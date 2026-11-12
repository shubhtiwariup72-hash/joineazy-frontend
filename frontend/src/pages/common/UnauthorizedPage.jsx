import { ShieldAlert } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ROLES } from '../../constants/roles'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'

export function UnauthorizedPage() {
  const { user } = useAuth()
  const dashboardLink =
    user?.role === ROLES.PROFESSOR
      ? ROUTES.PROFESSOR_DASHBOARD
      : ROUTES.STUDENT_DASHBOARD

  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-rose-50/80 text-rose-600 mb-4 border border-rose-100 shadow-3xs">
        <ShieldAlert className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Access Restricted</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed font-normal">
        You do not possess the required institutional role or permissions to access this page.
      </p>
      <div className="mt-6">
        <Link to={dashboardLink}>
          <Button variant="primary">Return to My Dashboard</Button>
        </Link>
      </div>
    </div>
  )
}
