export type UserRole = 'admin' | 'client'

export interface UserAccount {
  id: string
  email: string
  password: string
  role: UserRole
  createdAt: string
}

export interface Session {
  userId: string
}
