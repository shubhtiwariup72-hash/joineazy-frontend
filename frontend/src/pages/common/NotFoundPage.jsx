import { HelpCircle } from 'lucide-react'
import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button'
import { ROUTES } from '../../constants/routes'

export function NotFoundPage() {
  return (
    <div className="flex min-h-[70vh] flex-col items-center justify-center text-center px-4">
      <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-indigo-50/80 text-indigo-600 mb-4 border border-indigo-100 shadow-3xs">
        <HelpCircle className="h-8 w-8" />
      </div>
      <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Page Not Found</h1>
      <p className="mt-2 max-w-md text-sm text-slate-500 leading-relaxed font-normal">
        The destination you requested does not exist or may have been relocated.
      </p>
      <div className="mt-6">
        <Link to={ROUTES.HOME}>
          <Button variant="primary">Return Home</Button>
        </Link>
      </div>
    </div>
  )
}
