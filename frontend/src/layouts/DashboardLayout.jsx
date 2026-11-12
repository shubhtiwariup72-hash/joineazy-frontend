import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Header } from '../components/layout/Header'
import { Sidebar } from '../components/layout/Sidebar'
import { CourseProvider } from '../context/CourseContext'

export function DashboardLayout() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  return (
    <CourseProvider>
      <div className="flex min-h-screen bg-slate-50 text-slate-900">
        <Sidebar
          isOpen={isMobileMenuOpen}
          onClose={() => setIsMobileMenuOpen(false)}
        />
        <div className="flex flex-1 flex-col min-w-0 overflow-hidden">
          <Header onMobileMenuToggle={() => setIsMobileMenuOpen((prev) => !prev)} />
          <main className="flex-1 overflow-y-auto min-w-0 px-3.5 py-6 sm:px-6 sm:py-8 lg:px-8">
            <div className="mx-auto max-w-7xl">
              <Outlet />
            </div>
          </main>
        </div>
      </div>
    </CourseProvider>
  )
}

