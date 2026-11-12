import { LogOut, Menu, User } from 'lucide-react'
import { ROLES } from '../../constants/roles'
import { useAuth } from '../../hooks/useAuth'
import { Badge } from '../ui/Badge'
import { Button } from '../ui/Button'

export function Header({ onMobileMenuToggle }) {
  const { user, logout } = useAuth()

  const isProfessor = user?.role === ROLES.PROFESSOR

  return (
    <header className="sticky top-0 z-30 flex h-16 w-full items-center justify-between border-b border-slate-200/80 bg-white/90 px-3 sm:px-6 lg:px-8 backdrop-blur-md shadow-3xs">
      <div className="flex items-center gap-2 sm:gap-3">
        <button
          type="button"
          onClick={onMobileMenuToggle}
          className="flex h-11 w-11 items-center justify-center rounded-xl text-slate-500 hover:bg-slate-100 hover:text-slate-800 lg:hidden cursor-pointer transition-colors"
          aria-label="Toggle navigation menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <div className="hidden sm:block">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Education Portal
          </span>
          <h2 className="text-sm font-bold text-slate-900 tracking-tight">
            {isProfessor ? 'Professor Workspace' : 'Student Learning Hub'}
          </h2>
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        {user && (
          <div className="flex items-center gap-2 sm:gap-2.5">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-indigo-700 text-white font-bold text-sm shadow-xs shadow-indigo-500/20 ring-2 ring-white">
              {user.name ? user.name.charAt(0).toUpperCase() : <User className="h-4 w-4" />}
            </div>
            <div className="hidden md:flex flex-col text-left">
              <span className="text-sm font-bold text-slate-800 leading-tight">
                {user.name}
              </span>
              <span className="text-xs text-slate-400 truncate max-w-[170px] font-medium">
                {user.email}
              </span>
            </div>
            <Badge
              variant={isProfessor ? 'primary' : 'purple'}
              size="sm"
              className="ml-1 hidden sm:inline-flex"
            >
              {isProfessor ? 'Professor' : 'Student'}
            </Badge>
          </div>
        )}

        <div className="h-5 w-px bg-slate-200" />

        <Button
          variant="ghost"
          size="sm"
          onClick={logout}
          icon={LogOut}
          aria-label="Sign Out"
          className="text-slate-600 hover:text-rose-600 hover:bg-rose-50 min-h-[44px]"
        >
          <span className="hidden sm:inline">Sign Out</span>
        </Button>
      </div>
    </header>
  )
}
