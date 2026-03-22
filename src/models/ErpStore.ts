import type {
  ErpState,
  Product,
  Customer,
  Order,
  ManagementSystemBase,
  LibraryBook,
  ExamPaper,
  CampusTour,
  ELearningLesson,
  AcademicBulletin,
  CourseOffering,
  ActivityLog,
  ClientProductHistory,
  ClientExamHistory,
  ClientLibraryHistory,
  ClientCampusHistory,
  ClientElearningHistory,
  ClientAcademicHistory,
  ClientCourseHistory,
} from '../types/erp'

const STORAGE_KEY = 'erp-state'

const now = () => new Date().toISOString()

const buildId = () => crypto.randomUUID()

const seedProducts: Product[] = [
  {
    id: buildId(),
    name: 'Laptop Pro 14',
    sku: 'LTP-14',
    price: 1500,
    stock: 12,
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: buildId(),
    name: 'Office Chair',
    sku: 'CHR-23',
    price: 240,
    stock: 30,
    createdAt: now(),
    updatedAt: now(),
  },
]

const seedCustomers: Customer[] = [
  {
    id: buildId(),
    name: 'Alice Brown',
    email: 'alice@demo.com',
    phone: '+1 555-0101',
    createdAt: now(),
    updatedAt: now(),
  },
  {
    id: buildId(),
    name: 'Mohamed Saleh',
    email: 'mohamed@demo.com',
    phone: '+1 555-0102',
    createdAt: now(),
    updatedAt: now(),
  },
]

const seedOrders = (products: Product[], customers: Customer[]): Order[] => [
  {
    id: buildId(),
    customerId: customers[0].id,
    productId: products[0].id,
    quantity: 1,
    total: products[0].price,
    status: 'pending',
    createdAt: now(),
    updatedAt: now(),
  },
]

const buildManagementSystem = (
  name: string,
  owner: string,
  status: ManagementSystemBase['status'],
  description: string,
): ManagementSystemBase => ({
  id: buildId(),
  name,
  owner,
  status,
  description,
  createdAt: now(),
  updatedAt: now(),
})

const buildSeedState = (): ErpState => {
  const products = seedProducts
  const customers = seedCustomers
  const examManagementSystems = [
    buildManagementSystem(
      'Midterm Assessment Module',
      'Exams Office',
      'active',
      'Schedules exams, rooms, and grading workflows.',
    ),
  ]
  const libraryManagementSystems = [
    buildManagementSystem(
      'Digital Library Core',
      'Library Team',
      'active',
      'Cataloging, borrowing, and overdue notifications.',
    ),
  ]
  const campusManagementSystems = [
    buildManagementSystem(
      'Campus Facilities',
      'Operations Team',
      'active',
      'Campus maps, tours, and facility information.',
    ),
  ]
  const elearningManagementSystems = [
    buildManagementSystem(
      'LMS Portal',
      'E-Learning Unit',
      'active',
      'Hosts online classes, assignments, and attendance.',
    ),
  ]
  const academicManagementSystems = [
    buildManagementSystem(
      'Academic Records',
      'Registrar',
      'active',
      'Manages student records, grading, and transcripts.',
    ),
  ]
  const courseManagementSystems = [
    buildManagementSystem(
      'Course Planner',
      'Curriculum Office',
      'active',
      'Builds curricula, prerequisites, and course sections.',
    ),
  ]

  const exam = examManagementSystems[0]
  const library = libraryManagementSystems[0]
  const campus = campusManagementSystems[0]
  const elearning = elearningManagementSystems[0]
  const academic = academicManagementSystems[0]
  const course = courseManagementSystems[0]
  const p0 = products[0]
  const p1 = products[1]

  const bookId = buildId()
  const paperId = buildId()
  const tourId = buildId()
  const lessonId = buildId()
  const bulletinId = buildId()
  const offeringId = buildId()

  const libraryBooks: LibraryBook[] = [
    {
      id: bookId,
      libraryModuleId: library.id,
      title: 'Introduction to Data Science',
      author: 'Dr. Chen',
      isbn: '978-0000000001',
      copiesAvailable: 4,
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const examPapers: ExamPaper[] = [
    {
      id: paperId,
      examModuleId: exam.id,
      title: 'Midterm Practice — Algebra',
      durationMinutes: 90,
      maxScore: 100,
      description: 'Covers chapters 1–4. Online proctored.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const campusTours: CampusTour[] = [
    {
      id: tourId,
      campusModuleId: campus.id,
      title: 'Science Quad & Labs Walkthrough',
      tourDate: '2026-04-05T14:00',
      meetingPoint: 'Main Gate Fountain',
      spotsAvailable: 20,
      details: 'Guided tour of labs B-wing and library annex.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const elearningLessons: ELearningLesson[] = [
    {
      id: lessonId,
      elearningModuleId: elearning.id,
      title: 'Module 3: ERP Workflows',
      durationMinutes: 45,
      contentUrl: 'https://example.edu/lms/erp-3',
      summary: 'Orders, inventory, and campus integrations.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const academicBulletins: AcademicBulletin[] = [
    {
      id: bulletinId,
      academicModuleId: academic.id,
      title: 'Fall 2025 Transcript window',
      category: 'deadline',
      body: 'Official transcript requests accepted through Dec 15.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const courseOfferings: CourseOffering[] = [
    {
      id: offeringId,
      courseModuleId: course.id,
      code: 'BUS-301',
      title: 'Operations & ERP',
      instructor: 'Prof. Rivera',
      semester: 'Spring 2026',
      capacity: 35,
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const activityLogs: ActivityLog[] = [
    {
      id: buildId(),
      actorRole: 'client',
      actorEmail: 'client@gmail.com',
      module: 'library',
      action: 'borrow_book',
      summary: 'Borrowed “Introduction to Data Science”',
      relatedEntityId: bookId,
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: buildId(),
      actorRole: 'admin',
      actorEmail: 'admin@gmail.com',
      module: 'exam',
      action: 'publish_exam',
      summary: 'Published exam paper Midterm Practice — Algebra',
      relatedEntityId: paperId,
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const clientProductHistories: ClientProductHistory[] = [
    {
      id: buildId(),
      productId: p0.id,
      action: 'inquiry',
      quantity: 1,
      notes: 'Asked about warranty and delivery window.',
      createdAt: now(),
      updatedAt: now(),
    },
    {
      id: buildId(),
      productId: p1.id,
      action: 'wishlist',
      quantity: 2,
      notes: 'Planning office refresh next quarter.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const clientExamHistories: ClientExamHistory[] = [
    {
      id: buildId(),
      examPaperId: paperId,
      examModuleId: exam.id,
      examName: 'Midterm Practice — Algebra',
      examDate: '2026-03-15',
      score: 88,
      status: 'completed',
      notes: 'Completed via online proctoring.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const clientLibraryHistories: ClientLibraryHistory[] = [
    {
      id: buildId(),
      bookId,
      libraryModuleId: library.id,
      itemTitle: 'Introduction to Data Science',
      borrowedAt: '2026-03-01',
      dueAt: '2026-03-21',
      status: 'borrowed',
      notes: 'Renewal requested once.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const clientCampusHistories: ClientCampusHistory[] = [
    {
      id: buildId(),
      tourId,
      campusModuleId: campus.id,
      tourTitle: 'Science Quad & Labs Walkthrough',
      signupDate: '2026-03-10',
      partySize: 2,
      status: 'registered',
      notes: 'Wheelchair access requested.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const clientElearningHistories: ClientElearningHistory[] = [
    {
      id: buildId(),
      lessonId,
      elearningModuleId: elearning.id,
      activityTitle: 'Module 3: ERP Workflows',
      progressPercent: 65,
      lastAccessed: '2026-03-19',
      notes: 'Resuming from quiz section.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const clientAcademicHistories: ClientAcademicHistory[] = [
    {
      id: buildId(),
      bulletinId,
      academicModuleId: academic.id,
      recordType: 'transcript_request',
      term: 'Fall 2025',
      value: 'pending',
      notes: 'Official transcript for employer.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  const clientCourseHistories: ClientCourseHistory[] = [
    {
      id: buildId(),
      offeringId,
      courseModuleId: course.id,
      courseName: 'BUS-301 Operations & ERP',
      enrollmentStatus: 'enrolled',
      enrolledAt: '2026-02-01',
      notes: 'Prerequisites cleared.',
      createdAt: now(),
      updatedAt: now(),
    },
  ]

  return {
    products,
    customers,
    orders: seedOrders(products, customers),
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
    clientProductHistories,
    clientExamHistories,
    clientLibraryHistories,
    clientCampusHistories,
    clientElearningHistories,
    clientAcademicHistories,
    clientCourseHistories,
  }
}

export class ErpStore {
  private state: ErpState

  constructor() {
    this.state = this.readFromStorage()
  }

  private readFromStorage(): ErpState {
    const raw = localStorage.getItem(STORAGE_KEY)
    const seed = buildSeedState()
    if (!raw) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(seed))
      return seed
    }
    const parsed = JSON.parse(raw) as Partial<ErpState>
    return {
      ...seed,
      ...parsed,
      products: parsed.products ?? seed.products,
      customers: parsed.customers ?? seed.customers,
      orders: parsed.orders ?? seed.orders,
      examManagementSystems: parsed.examManagementSystems ?? seed.examManagementSystems,
      libraryManagementSystems:
        parsed.libraryManagementSystems ?? seed.libraryManagementSystems,
      campusManagementSystems: parsed.campusManagementSystems ?? seed.campusManagementSystems,
      elearningManagementSystems:
        parsed.elearningManagementSystems ?? seed.elearningManagementSystems,
      academicManagementSystems:
        parsed.academicManagementSystems ?? seed.academicManagementSystems,
      courseManagementSystems:
        parsed.courseManagementSystems ?? seed.courseManagementSystems,
      libraryBooks: parsed.libraryBooks ?? seed.libraryBooks,
      examPapers: parsed.examPapers ?? seed.examPapers,
      campusTours: parsed.campusTours ?? seed.campusTours,
      elearningLessons: parsed.elearningLessons ?? seed.elearningLessons,
      academicBulletins: parsed.academicBulletins ?? seed.academicBulletins,
      courseOfferings: parsed.courseOfferings ?? seed.courseOfferings,
      activityLogs: parsed.activityLogs ?? seed.activityLogs,
      clientProductHistories:
        parsed.clientProductHistories ?? seed.clientProductHistories,
      clientExamHistories: parsed.clientExamHistories ?? seed.clientExamHistories,
      clientLibraryHistories:
        parsed.clientLibraryHistories ?? seed.clientLibraryHistories,
      clientCampusHistories:
        parsed.clientCampusHistories ?? seed.clientCampusHistories,
      clientElearningHistories:
        parsed.clientElearningHistories ?? seed.clientElearningHistories,
      clientAcademicHistories:
        parsed.clientAcademicHistories ?? seed.clientAcademicHistories,
      clientCourseHistories:
        parsed.clientCourseHistories ?? seed.clientCourseHistories,
    }
  }

  private persist() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.state))
  }

  getState(): ErpState {
    return this.state
  }

  updateState(nextState: ErpState): ErpState {
    this.state = nextState
    this.persist()
    return this.state
  }
}
