import { GraduationCap, ShieldCheck } from 'lucide-react'
import { Outlet } from 'react-router-dom'

export function AuthLayout() {
  return (
    <div className="flex min-h-screen bg-slate-50/70">
      <div className="flex flex-1 flex-col justify-center px-4 py-8 sm:px-6 sm:py-12 lg:flex-none lg:px-20 xl:px-24">
        <div className="mx-auto w-full max-w-sm lg:w-96">
          <div className="mb-8">
            <div className="flex items-center gap-2.5">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-md shadow-indigo-500/20">
                <GraduationCap className="h-6 w-6" />
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-900">
                Joineazy
              </span>
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Academic Assignment & Collaborative Learning Portal
            </p>
          </div>

          <Outlet />
        </div>
      </div>

      <div className="relative hidden w-0 flex-1 lg:block bg-gradient-to-br from-indigo-900 via-indigo-950 to-slate-900 text-white p-12">
        <div className="flex h-full flex-col justify-between">
          <div className="flex items-center gap-2 text-indigo-300">
            <ShieldCheck className="h-5 w-5" />
            <span className="text-xs font-bold tracking-wider uppercase">
              Role-Based Authentication & Collaboration
            </span>
          </div>

          <div className="max-w-md space-y-6">
            <h1 className="text-3xl font-extrabold tracking-tight text-white leading-tight">
              Streamline academic courses, collaborative groups, and assignment acknowledgements.
            </h1>
            <p className="text-base text-indigo-200/90 leading-relaxed font-normal">
              Designed for universities and professors to publish course assignments, track student completion rates, and manage student group leadership seamlessly.
            </p>

            <div className="rounded-2xl border border-indigo-500/20 bg-white/5 p-4 backdrop-blur-xs">
              <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider block mb-2">
                Pre-configured Demo Accounts
              </span>
              <div className="space-y-2 text-xs text-indigo-100">
                <div>
                  <span className="font-bold text-white">Professor:</span> professor@joineazy.edu (password: password123)
                </div>
                <div>
                  <span className="font-bold text-white">Student 1 (Leader):</span> student1@joineazy.edu (password: password123)
                </div>
                <div>
                  <span className="font-bold text-white">Student 2 (Member):</span> student2@joineazy.edu (password: password123)
                </div>
                <div>
                  <span className="font-bold text-white">Student 3 (Solo):</span> student3@joineazy.edu (password: password123)
                </div>
              </div>
            </div>
          </div>

          <div className="text-xs text-indigo-400 font-medium">
            Frontend Assessment Specification
          </div>
        </div>
      </div>
    </div>
  )
}
