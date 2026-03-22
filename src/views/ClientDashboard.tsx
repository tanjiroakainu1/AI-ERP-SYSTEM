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
import { ModuleNavPicker } from './components/ModuleNavPicker'

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
    <div className="grid min-w-0 gap-3 md:gap-4">
      <ModuleNavPicker
        id="client-module-nav"
        heading="Client Modules"
        description="Choose a module below."
        pages={pages}
        active={activePage}
        onSelect={setActivePage}
        variant="client"
      />

      {renderActivePage()}
    </div>
  )
}
