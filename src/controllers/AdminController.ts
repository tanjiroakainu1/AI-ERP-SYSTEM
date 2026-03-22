import { CrudController } from './CrudController'
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

export interface AdminController {
  products: CrudController<Product, 'products'>
  customers: CrudController<Customer, 'customers'>
  orders: CrudController<Order, 'orders'>
  examManagementSystems: CrudController<ExamManagementSystem, 'examManagementSystems'>
  libraryManagementSystems: CrudController<
    LibraryManagementSystem,
    'libraryManagementSystems'
  >
  campusManagementSystems: CrudController<CampusManagementSystem, 'campusManagementSystems'>
  elearningManagementSystems: CrudController<
    ELearningManagementSystem,
    'elearningManagementSystems'
  >
  academicManagementSystems: CrudController<
    AcademicManagementSystem,
    'academicManagementSystems'
  >
  courseManagementSystems: CrudController<CourseManagementSystem, 'courseManagementSystems'>
  libraryBooks: CrudController<LibraryBook, 'libraryBooks'>
  examPapers: CrudController<ExamPaper, 'examPapers'>
  campusTours: CrudController<CampusTour, 'campusTours'>
  elearningLessons: CrudController<ELearningLesson, 'elearningLessons'>
  academicBulletins: CrudController<AcademicBulletin, 'academicBulletins'>
  courseOfferings: CrudController<CourseOffering, 'courseOfferings'>
  activityLogs: CrudController<ActivityLog, 'activityLogs'>
}
