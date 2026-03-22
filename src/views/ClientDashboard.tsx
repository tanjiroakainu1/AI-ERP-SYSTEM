import type { ClientController } from '../controllers/ClientController'
import type { ActivityService } from '../controllers/activityService'
import { useMemo, useState } from 'react'
import { ClientProductsPage } from './client/ClientProductsPage'
import { ClientOrdersPage } from './client/ClientOrdersPage'
import { ClientExamPage } from './client/ClientExamPage'
import { ClientLibraryPage } from './client/ClientLibraryPage'
import { ClientCampusPage } from './client/ClientCampusPage'
import { ClientElearningPage } from './client/ClientElearningPage'
import { ClientAcademicPage } from './client/ClientAcademicPage'
import { ClientCoursePage } from './client/ClientCoursePage'
import { ClientActivityPage } from './client/ClientActivityPage'

interface Props {
  controllers: ClientController
  activity: ActivityService
  userEmail: string
}

type ClientPageKey =
  | 'products'
  | 'orders'
  | 'exam'
  | 'library'
  | 'campus'
  | 'elearning'
  | 'academic'
  | 'course'
  | 'activity'

export function ClientDashboard({ controllers, activity, userEmail }: Props) {
  const [activePage, setActivePage] = useState<ClientPageKey>('products')

  const pages = useMemo(
    () => [
      { key: 'products' as const, label: 'Product Catalog' },
      { key: 'orders' as const, label: 'My Orders' },
      { key: 'exam' as const, label: 'Exam Management' },
      { key: 'library' as const, label: 'Library Management' },
      { key: 'campus' as const, label: 'Campus Management' },
      { key: 'elearning' as const, label: 'E-learning Management' },
      { key: 'academic' as const, label: 'Academic Management' },
      { key: 'course' as const, label: 'Course Management' },
      { key: 'activity' as const, label: 'My Activity' },
    ],
    [],
  )

  const renderActivePage = () => {
    switch (activePage) {
      case 'products':
        return (
          <ClientProductsPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'orders':
        return (
          <ClientOrdersPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'exam':
        return (
          <ClientExamPage controllers={controllers} activity={activity} userEmail={userEmail} />
        )
      case 'library':
        return (
          <ClientLibraryPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'campus':
        return (
          <ClientCampusPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'elearning':
        return (
          <ClientElearningPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'academic':
        return (
          <ClientAcademicPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'course':
        return (
          <ClientCoursePage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
      case 'activity':
        return <ClientActivityPage activity={activity} userEmail={userEmail} />
      default:
        return (
          <ClientProductsPage
            controllers={controllers}
            activity={activity}
            userEmail={userEmail}
          />
        )
    }
  }

  return (
    <div className="grid gap-4">
      <section className="rounded-2xl border border-violet-500/25 bg-slate-950/55 p-4 shadow-[0_0_40px_-12px_rgba(139,92,246,0.22)] backdrop-blur-xl sm:p-5">
        <h2 className="text-lg font-semibold text-violet-100">Client Modules</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {pages.map((page) => (
            <button
              key={page.key}
              type="button"
              onClick={() => setActivePage(page.key)}
              className={`touch-manipulation rounded-xl border px-3 py-2.5 text-left text-sm font-semibold leading-snug transition sm:py-2 ${
                activePage === page.key
                  ? 'border-violet-400/50 bg-gradient-to-r from-violet-600/40 to-cyan-600/35 text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.35)]'
                  : 'border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-violet-500/30 hover:text-white'
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
