import { ErpStore } from '../models/ErpStore'
import { AuthStore } from '../models/AuthStore'
import { CrudController } from './CrudController'
import { AuthController } from './AuthController'
import type { AdminController } from './AdminController'
import { createClientController, type ClientController } from './ClientController'
import { createActivityService, type ActivityService } from './activityService'
import type {
  Customer,
  Order,
  Product,
  ExamManagementSystem,
  LibraryManagementSystem,
  CampusManagementSystem,
  ELearningManagementSystem,
  AcademicManagementSystem,
  CourseManagementSystem,
  LibraryBook,
  ExamPaper,
  CampusTour,
  ELearningLesson,
  AcademicBulletin,
  CourseOffering,
  ActivityLog,
} from '../types/erp'

export interface ErpControllers {
  admin: AdminController
  client: ClientController
  auth: AuthController
  activity: ActivityService
}

export class ErpControllerFactory {
  static create(): ErpControllers {
    const store = new ErpStore()
    const products = new CrudController<Product, 'products'>(store, 'products')
    const customers = new CrudController<Customer, 'customers'>(store, 'customers')
    const orders = new CrudController<Order, 'orders'>(store, 'orders')
    const examManagementSystems = new CrudController<
      ExamManagementSystem,
      'examManagementSystems'
    >(store, 'examManagementSystems')
    const libraryManagementSystems = new CrudController<
      LibraryManagementSystem,
      'libraryManagementSystems'
    >(store, 'libraryManagementSystems')
    const campusManagementSystems = new CrudController<
      CampusManagementSystem,
      'campusManagementSystems'
    >(store, 'campusManagementSystems')
    const elearningManagementSystems = new CrudController<
      ELearningManagementSystem,
      'elearningManagementSystems'
    >(store, 'elearningManagementSystems')
    const academicManagementSystems = new CrudController<
      AcademicManagementSystem,
      'academicManagementSystems'
    >(store, 'academicManagementSystems')
    const courseManagementSystems = new CrudController<
      CourseManagementSystem,
      'courseManagementSystems'
    >(store, 'courseManagementSystems')
    const libraryBooks = new CrudController<LibraryBook, 'libraryBooks'>(store, 'libraryBooks')
    const examPapers = new CrudController<ExamPaper, 'examPapers'>(store, 'examPapers')
    const campusTours = new CrudController<CampusTour, 'campusTours'>(store, 'campusTours')
    const elearningLessons = new CrudController<ELearningLesson, 'elearningLessons'>(
      store,
      'elearningLessons',
    )
    const academicBulletins = new CrudController<AcademicBulletin, 'academicBulletins'>(
      store,
      'academicBulletins',
    )
    const courseOfferings = new CrudController<CourseOffering, 'courseOfferings'>(
      store,
      'courseOfferings',
    )
    const activityLogs = new CrudController<ActivityLog, 'activityLogs'>(store, 'activityLogs')
    const authStore = new AuthStore()
    const auth = new AuthController(authStore, customers)
    const client = createClientController(store)
    const activity = createActivityService(store)

    return {
      admin: {
        products,
        customers,
        orders,
        examManagementSystems,
        libraryManagementSystems,
        campusManagementSystems,
        elearningManagementSystems,
        academicManagementSystems,
        courseManagementSystems,
        libraryBooks,
        examPapers,
        campusTours,
        elearningLessons,
        academicBulletins,
        courseOfferings,
        activityLogs,
      },
      client,
      auth,
      activity,
    }
  }
}
