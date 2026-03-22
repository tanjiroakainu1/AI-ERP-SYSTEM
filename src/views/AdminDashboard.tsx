import { useMemo, useState } from 'react'
import type { AdminController } from '../controllers/AdminController'
import type { ActivityService } from '../controllers/activityService'
import { AdminProductsPage } from './admin/AdminProductsPage'
import { AdminCustomersPage } from './admin/AdminCustomersPage'
import { AdminOrdersPage } from './admin/AdminOrdersPage'
import { AdminExamPage } from './admin/AdminExamPage'
import { AdminLibraryPage } from './admin/AdminLibraryPage'
import { AdminCampusPage } from './admin/AdminCampusPage'
import { AdminElearningPage } from './admin/AdminElearningPage'
import { AdminAcademicPage } from './admin/AdminAcademicPage'
import { AdminCoursePage } from './admin/AdminCoursePage'
import { AdminActivityPage } from './admin/AdminActivityPage'

interface Props {
  controllers: AdminController
  activity: ActivityService
  userEmail: string
}

type AdminPageKey =
  | 'products'
  | 'customers'
  | 'orders'
  | 'exam'
  | 'library'
  | 'campus'
  | 'elearning'
  | 'academic'
  | 'course'
  | 'activity'

export function AdminDashboard({ controllers, activity, userEmail }: Props) {
  const [activePage, setActivePage] = useState<AdminPageKey>('products')

  const pages = useMemo(
    () => [
      { key: 'products' as const, label: 'Products' },
      { key: 'customers' as const, label: 'Customers' },
      { key: 'orders' as const, label: 'Orders' },
      { key: 'exam' as const, label: 'Exam Management' },
      { key: 'library' as const, label: 'Library Management' },
      { key: 'campus' as const, label: 'Campus Management' },
      { key: 'elearning' as const, label: 'E-learning Management' },
      { key: 'academic' as const, label: 'Academic Management' },
      { key: 'course' as const, label: 'Course Management' },
      { key: 'activity' as const, label: 'Activity / Audit' },
    ],
    [],
  )

  const renderActivePage = () => {
    switch (activePage) {
      case 'products':
        return (
          <AdminProductsPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'customers':
        return (
          <AdminCustomersPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'orders':
        return (
          <AdminOrdersPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'exam':
        return (
          <AdminExamPage controllers={controllers} activity={activity} userEmail={userEmail} />
        )
      case 'library':
        return (
          <AdminLibraryPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'campus':
        return (
          <AdminCampusPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'elearning':
        return (
          <AdminElearningPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'academic':
        return (
          <AdminAcademicPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'course':
        return (
          <AdminCoursePage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'activity':
        return <AdminActivityPage activity={activity} />
      default:
        return (
          <AdminProductsPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
    }
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border border-cyan-500/25 bg-slate-950/55 p-4 shadow-[0_0_40px_-12px_rgba(34,211,238,0.25)] backdrop-blur-xl sm:p-5">
        <h2 className="text-lg font-semibold text-cyan-100">Admin Modules</h2>
        <p className="mt-1 text-sm text-slate-400">Select a module to manage records.</p>
        <div className="mt-4 flex flex-wrap gap-2">
          {pages.map((page) => (
            <button
              key={page.key}
              type="button"
              onClick={() => setActivePage(page.key)}
              className={`touch-manipulation rounded-xl border px-3 py-2.5 text-left text-sm font-semibold leading-snug transition sm:py-2 ${
                activePage === page.key
                  ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-600/40 to-violet-600/40 text-white shadow-[0_0_20px_-4px_rgba(34,211,238,0.35)]'
                  : 'border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-cyan-500/30 hover:text-white'
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </section>

      {renderActivePage()}
    </div>
  )
}
