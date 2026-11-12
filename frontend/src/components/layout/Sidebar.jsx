import { BookOpen, GraduationCap, LayoutDashboard, Users, X } from 'lucide-react'
import { NavLink } from 'react-router-dom'
import { ROLES } from '../../constants/roles'
import { ROUTES } from '../../constants/routes'
import { useAuth } from '../../hooks/useAuth'
import { cn } from '../../utils/cn'

export function Sidebar({ isOpen, onClose }) {
  const { user } = useAuth()
  const isProfessor = user?.role === ROLES.PROFESSOR

  const navItems = isProfessor
    ? [
        {
          label: 'Dashboard',
          href: ROUTES.PROFESSOR_DASHBOARD,
          icon: LayoutDashboard,
        },
      ]
    : [
        {
          label: 'Enrolled Courses',
          href: ROUTES.STUDENT_DASHBOARD,
          icon: BookOpen,
        },
      ]

  return (
    <>
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-slate-900/50 backdrop-blur-xs lg:hidden transition-opacity"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 flex w-64 flex-col border-r border-slate-200/80 bg-white transition-transform duration-200 ease-in-out lg:static lg:translate-x-0 shadow-2xs',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex h-16 items-center justify-between border-b border-slate-200/80 px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white shadow-xs shadow-indigo-500/30">
              <GraduationCap className="h-5 w-5" />
            </div>
            <div>
              <span className="text-lg font-bold text-slate-900 tracking-tight">
                Joineazy
              </span>
              <span className="block text-[10px] uppercase font-bold tracking-wider text-indigo-600 -mt-1">
                Academic Portal
              </span>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-11 w-11 items-center justify-center rounded-lg text-slate-400 hover:bg-slate-100 hover:text-slate-600 lg:hidden cursor-pointer transition-colors"
            aria-label="Close sidebar"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-between overflow-y-auto p-4">
          <nav className="space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Main Menu
            </div>
            {navItems.map((item) => (
              <NavLink
                key={item.href}
                to={item.href}
                onClick={onClose}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-semibold transition-all duration-150',
                    isActive
                      ? 'bg-indigo-50/90 text-indigo-700 shadow-3xs'
                      : 'text-slate-600 hover:bg-slate-100/80 hover:text-slate-900'
                  )
                }
              >
                <item.icon className="h-4 w-4 shrink-0" />
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="rounded-2xl border border-slate-200/80 bg-slate-50/70 p-4 shadow-3xs">
            <div className="flex items-center gap-2 text-xs font-bold text-slate-800">
              <Users className="h-4 w-4 text-indigo-600" />
              Role Authorization
            </div>
            <p className="mt-1.5 text-xs text-slate-500 leading-relaxed font-normal">
              {isProfessor
                ? 'Create & edit assignments, view progress metrics, track student and group submissions.'
                : 'View deadlines, collaborate in groups, submit individual or group work acknowledgements.'}
            </p>
          </div>
        </div>
      </aside>
    </>
  )
}
