import type { Session, UserAccount } from '../types/auth'

const USERS_KEY = 'erp-auth-users'
const SESSION_KEY = 'erp-auth-session'

const now = () => new Date().toISOString()

const seedUsers = (): UserAccount[] => [
  {
    id: crypto.randomUUID(),
    email: 'admin@gmail.com',
    password: 'admin123',
    role: 'admin',
    createdAt: now(),
  },
  {
    id: crypto.randomUUID(),
    email: 'client@gmail.com',
    password: 'client123',
    role: 'client',
    createdAt: now(),
  },
]

export class AuthStore {
  constructor() {
    this.ensureSeedUsers()
  }

  private ensureSeedUsers() {
    const existing = localStorage.getItem(USERS_KEY)
    if (existing) {
      return
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(seedUsers()))
  }

  getUsers(): UserAccount[] {
    const raw = localStorage.getItem(USERS_KEY)
    if (!raw) {
      return []
    }
    return JSON.parse(raw) as UserAccount[]
  }

  saveUsers(users: UserAccount[]) {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }

  getSession(): Session | null {
    const raw = localStorage.getItem(SESSION_KEY)
    if (!raw) {
      return null
    }
    return JSON.parse(raw) as Session
  }

  saveSession(session: Session) {
    localStorage.setItem(SESSION_KEY, JSON.stringify(session))
  }

  clearSession() {
    localStorage.removeItem(SESSION_KEY)
  }
}
