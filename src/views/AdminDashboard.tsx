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
import { ModuleNavPicker } from './components/ModuleNavPicker'

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
    <div className="grid min-w-0 gap-3 md:gap-4">
      <ModuleNavPicker
        id="admin-module-nav"
        heading="Admin Modules"
        description="Select a module to manage records."
        pages={pages}
        active={activePage}
        onSelect={setActivePage}
        variant="admin"
      />

      {renderActivePage()}
    </div>
  )
}
