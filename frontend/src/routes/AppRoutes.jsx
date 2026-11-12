import { Navigate, Route, Routes } from 'react-router-dom'
import { ROLES } from '../constants/roles'
import { ROUTES } from '../constants/routes'
import { useAuth } from '../hooks/useAuth'
import { AuthLayout } from '../layouts/AuthLayout'
import { DashboardLayout } from '../layouts/DashboardLayout'
import { LoginPage } from '../pages/auth/LoginPage'
import { RegisterPage } from '../pages/auth/RegisterPage'
import { NotFoundPage } from '../pages/common/NotFoundPage'
import { UnauthorizedPage } from '../pages/common/UnauthorizedPage'
import { ProfessorCoursePage } from '../pages/professor/ProfessorCoursePage'
import { ProfessorDashboard } from '../pages/professor/ProfessorDashboard'
import { StudentCoursePage } from '../pages/student/StudentCoursePage'
import { StudentDashboard } from '../pages/student/StudentDashboard'
import { StudentGroupsPage } from '../pages/student/StudentGroupsPage'
import { ProtectedRoute } from './ProtectedRoute'
import { RoleRoute } from './RoleRoute'

function RootRedirect() {
  const { user, isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return null
  }

  if (!isAuthenticated) {
    return <Navigate to={ROUTES.LOGIN} replace />
  }

  if (user?.role === ROLES.PROFESSOR) {
    return <Navigate to={ROUTES.PROFESSOR_DASHBOARD} replace />
  }

  return <Navigate to={ROUTES.STUDENT_DASHBOARD} replace />
}

export function AppRoutes() {
  return (
    <Routes>
      <Route path={ROUTES.HOME} element={<RootRedirect />} />

      <Route element={<AuthLayout />}>
        <Route path={ROUTES.LOGIN} element={<LoginPage />} />
        <Route path={ROUTES.REGISTER} element={<RegisterPage />} />
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route element={<RoleRoute allowedRoles={[ROLES.PROFESSOR]} />}>
            <Route
              path={ROUTES.PROFESSOR_DASHBOARD}
              element={<ProfessorDashboard />}
            />
            <Route
              path={ROUTES.PROFESSOR_COURSE}
              element={<ProfessorCoursePage />}
            />
          </Route>

          <Route element={<RoleRoute allowedRoles={[ROLES.STUDENT]} />}>
            <Route
              path={ROUTES.STUDENT_DASHBOARD}
              element={<StudentDashboard />}
            />
            <Route
              path={ROUTES.STUDENT_COURSE}
              element={<StudentCoursePage />}
            />
            <Route
              path={ROUTES.STUDENT_GROUPS}
              element={<StudentGroupsPage />}
            />
          </Route>

          <Route path={ROUTES.UNAUTHORIZED} element={<UnauthorizedPage />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  )
}

