import { CrudController } from './CrudController'
import type { ErpStore } from '../models/ErpStore'
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
  ClientProductHistory,
  ClientExamHistory,
  ClientLibraryHistory,
  ClientCampusHistory,
  ClientElearningHistory,
  ClientAcademicHistory,
  ClientCourseHistory,
} from '../types/erp'

/** Read-only snapshots of admin-published modules (client consumes via history CRUD). */
export interface ClientCatalog {
  customers: () => Customer[]
  products: () => Product[]
  examModules: () => ExamManagementSystem[]
  libraryModules: () => LibraryManagementSystem[]
  campusModules: () => CampusManagementSystem[]
  elearningModules: () => ELearningManagementSystem[]
  academicModules: () => AcademicManagementSystem[]
  courseModules: () => CourseManagementSystem[]
  libraryBooks: () => LibraryBook[]
  examPapers: () => ExamPaper[]
  campusTours: () => CampusTour[]
  elearningLessons: () => ELearningLesson[]
  academicBulletins: () => AcademicBulletin[]
  courseOfferings: () => CourseOffering[]
}

export interface ClientController {
  catalog: ClientCatalog
  orders: CrudController<Order, 'orders'>
  clientProductHistories: CrudController<ClientProductHistory, 'clientProductHistories'>
  clientExamHistories: CrudController<ClientExamHistory, 'clientExamHistories'>
  clientLibraryHistories: CrudController<ClientLibraryHistory, 'clientLibraryHistories'>
  clientCampusHistories: CrudController<ClientCampusHistory, 'clientCampusHistories'>
  clientElearningHistories: CrudController<ClientElearningHistory, 'clientElearningHistories'>
  clientAcademicHistories: CrudController<ClientAcademicHistory, 'clientAcademicHistories'>
  clientCourseHistories: CrudController<ClientCourseHistory, 'clientCourseHistories'>
}

export function createClientController(store: ErpStore): ClientController {
  const catalog: ClientCatalog = {
    customers: () => store.getState().customers,
    products: () => store.getState().products,
    examModules: () => store.getState().examManagementSystems,
    libraryModules: () => store.getState().libraryManagementSystems,
    campusModules: () => store.getState().campusManagementSystems,
    elearningModules: () => store.getState().elearningManagementSystems,
    academicModules: () => store.getState().academicManagementSystems,
    courseModules: () => store.getState().courseManagementSystems,
    libraryBooks: () => store.getState().libraryBooks,
    examPapers: () => store.getState().examPapers,
    campusTours: () => store.getState().campusTours,
    elearningLessons: () => store.getState().elearningLessons,
    academicBulletins: () => store.getState().academicBulletins,
    courseOfferings: () => store.getState().courseOfferings,
  }

  return {
    catalog,
    orders: new CrudController<Order, 'orders'>(store, 'orders'),
    clientProductHistories: new CrudController<ClientProductHistory, 'clientProductHistories'>(
      store,
      'clientProductHistories',
    ),
    clientExamHistories: new CrudController<ClientExamHistory, 'clientExamHistories'>(
      store,
      'clientExamHistories',
    ),
    clientLibraryHistories: new CrudController<ClientLibraryHistory, 'clientLibraryHistories'>(
      store,
      'clientLibraryHistories',
    ),
    clientCampusHistories: new CrudController<ClientCampusHistory, 'clientCampusHistories'>(
      store,
      'clientCampusHistories',
    ),
    clientElearningHistories: new CrudController<
      ClientElearningHistory,
      'clientElearningHistories'
    >(store, 'clientElearningHistories'),
    clientAcademicHistories: new CrudController<
      ClientAcademicHistory,
      'clientAcademicHistories'
    >(store, 'clientAcademicHistories'),
    clientCourseHistories: new CrudController<ClientCourseHistory, 'clientCourseHistories'>(
      store,
      'clientCourseHistories',
    ),
  }
}
