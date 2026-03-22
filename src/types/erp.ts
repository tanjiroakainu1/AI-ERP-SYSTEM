export type EntityType =
  | 'products'
  | 'customers'
  | 'orders'
  | 'examManagementSystems'
  | 'libraryManagementSystems'
  | 'campusManagementSystems'
  | 'elearningManagementSystems'
  | 'academicManagementSystems'
  | 'courseManagementSystems'
  | 'libraryBooks'
  | 'examPapers'
  | 'campusTours'
  | 'elearningLessons'
  | 'academicBulletins'
  | 'courseOfferings'
  | 'activityLogs'
  | 'clientProductHistories'
  | 'clientExamHistories'
  | 'clientLibraryHistories'
  | 'clientCampusHistories'
  | 'clientElearningHistories'
  | 'clientAcademicHistories'
  | 'clientCourseHistories'

export interface BaseEntity {
  id: string
  createdAt: string
  updatedAt: string
}

export interface Product extends BaseEntity {
  name: string
  sku: string
  price: number
  stock: number
}

export interface Customer extends BaseEntity {
  name: string
  email: string
  phone: string
}

export interface Order extends BaseEntity {
  customerId: string
  productId: string
  quantity: number
  total: number
  status: 'pending' | 'paid' | 'shipped'
}

export interface ManagementSystemBase extends BaseEntity {
  name: string
  owner: string
  status: 'planning' | 'active' | 'on-hold'
  description: string
}

export type ExamManagementSystem = ManagementSystemBase
export type LibraryManagementSystem = ManagementSystemBase
export type CampusManagementSystem = ManagementSystemBase
export type ELearningManagementSystem = ManagementSystemBase
export type AcademicManagementSystem = ManagementSystemBase
export type CourseManagementSystem = ManagementSystemBase

/** Admin-published book in a library module (clients borrow by book ID). */
export interface LibraryBook extends BaseEntity {
  libraryModuleId: string
  title: string
  author: string
  isbn: string
  copiesAvailable: number
}

/** Admin-published exam clients can take. */
export interface ExamPaper extends BaseEntity {
  examModuleId: string
  title: string
  durationMinutes: number
  maxScore: number
  description: string
}

/** Admin-published campus tour clients can join. */
export interface CampusTour extends BaseEntity {
  campusModuleId: string
  title: string
  tourDate: string
  meetingPoint: string
  spotsAvailable: number
  details: string
}

/** Admin-published e-learning unit clients study. */
export interface ELearningLesson extends BaseEntity {
  elearningModuleId: string
  title: string
  durationMinutes: number
  contentUrl: string
  summary: string
}

/** Admin-published academic notice or form context. */
export interface AcademicBulletin extends BaseEntity {
  academicModuleId: string
  title: string
  category: string
  body: string
}

/** Admin-published course section clients enroll in. */
export interface CourseOffering extends BaseEntity {
  courseModuleId: string
  code: string
  title: string
  instructor: string
  semester: string
  capacity: number
}

/** Audit trail: what admin or client did, per module. */
export interface ActivityLog extends BaseEntity {
  actorRole: 'admin' | 'client'
  actorEmail: string
  module: string
  action: string
  summary: string
  relatedEntityId: string
}

export interface ClientProductHistory extends BaseEntity {
  productId: string
  action: string
  quantity: number
  notes: string
}

export interface ClientExamHistory extends BaseEntity {
  examPaperId: string
  examModuleId: string
  examName: string
  examDate: string
  score: number
  status: string
  notes: string
}

export interface ClientLibraryHistory extends BaseEntity {
  bookId: string
  libraryModuleId: string
  itemTitle: string
  borrowedAt: string
  dueAt: string
  status: string
  notes: string
}

export interface ClientCampusHistory extends BaseEntity {
  tourId: string
  campusModuleId: string
  tourTitle: string
  signupDate: string
  partySize: number
  status: string
  notes: string
}

export interface ClientElearningHistory extends BaseEntity {
  lessonId: string
  elearningModuleId: string
  activityTitle: string
  progressPercent: number
  lastAccessed: string
  notes: string
}

export interface ClientAcademicHistory extends BaseEntity {
  bulletinId: string
  academicModuleId: string
  recordType: string
  term: string
  value: string
  notes: string
}

export interface ClientCourseHistory extends BaseEntity {
  offeringId: string
  courseModuleId: string
  courseName: string
  enrollmentStatus: string
  enrolledAt: string
  notes: string
}

export interface ErpState {
  products: Product[]
  customers: Customer[]
  orders: Order[]
  examManagementSystems: ExamManagementSystem[]
  libraryManagementSystems: LibraryManagementSystem[]
  campusManagementSystems: CampusManagementSystem[]
  elearningManagementSystems: ELearningManagementSystem[]
  academicManagementSystems: AcademicManagementSystem[]
  courseManagementSystems: CourseManagementSystem[]
  libraryBooks: LibraryBook[]
  examPapers: ExamPaper[]
  campusTours: CampusTour[]
  elearningLessons: ELearningLesson[]
  academicBulletins: AcademicBulletin[]
  courseOfferings: CourseOffering[]
  activityLogs: ActivityLog[]
  clientProductHistories: ClientProductHistory[]
  clientExamHistories: ClientExamHistory[]
  clientLibraryHistories: ClientLibraryHistory[]
  clientCampusHistories: ClientCampusHistory[]
  clientElearningHistories: ClientElearningHistory[]
  clientAcademicHistories: ClientAcademicHistory[]
  clientCourseHistories: ClientCourseHistory[]
}
