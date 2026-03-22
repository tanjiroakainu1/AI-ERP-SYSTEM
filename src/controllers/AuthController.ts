import { AuthStore } from '../models/AuthStore'
import type { UserAccount } from '../types/auth'
import type { CrudController } from './CrudController'
import type { Customer } from '../types/erp'

interface RegisterInput {
  name: string
  email: string
  phone: string
  password: string
  confirmPassword: string
}

interface LoginResult {
  success: boolean
  user?: UserAccount
  message?: string
}

export class AuthController {
  private readonly store: AuthStore
  private readonly customersController: CrudController<Customer, 'customers'>

  constructor(store: AuthStore, customersController: CrudController<Customer, 'customers'>) {
    this.store = store
    this.customersController = customersController
  }

  getCurrentUser(): UserAccount | null {
    const session = this.store.getSession()
    if (!session) {
      return null
    }
    return this.store.getUsers().find((u) => u.id === session.userId) ?? null
  }

  login(email: string, password: string): LoginResult {
    const normalizedEmail = email.trim().toLowerCase()
    if (!normalizedEmail || !password.trim()) {
      return { success: false, message: 'Email and password are required.' }
    }

    const user = this.store
      .getUsers()
      .find(
        (candidate) =>
          candidate.email.toLowerCase() === normalizedEmail &&
          candidate.password === password,
      )
    if (!user) {
      return { success: false, message: 'Invalid email or password.' }
    }
    this.store.saveSession({ userId: user.id })
    return { success: true, user }
  }

  registerClient(payload: RegisterInput): LoginResult {
    const trimmedName = payload.name.trim()
    const normalizedEmail = payload.email.trim().toLowerCase()
    const trimmedPhone = payload.phone.trim()
    const trimmedPassword = payload.password.trim()
    const trimmedConfirmPassword = payload.confirmPassword.trim()

    if (!trimmedName || !normalizedEmail || !trimmedPhone || !trimmedPassword) {
      return { success: false, message: 'Please complete all registration fields.' }
    }

    if (!normalizedEmail.includes('@')) {
      return { success: false, message: 'Please enter a valid email address.' }
    }

    if (trimmedPassword.length < 6) {
      return { success: false, message: 'Password must be at least 6 characters.' }
    }

    if (trimmedPassword !== trimmedConfirmPassword) {
      return { success: false, message: 'Password and confirm password do not match.' }
    }

    const users = this.store.getUsers()
    const exists = users.some((u) => u.email.toLowerCase() === normalizedEmail)
    if (exists) {
      return { success: false, message: 'Email already exists.' }
    }

    const user: UserAccount = {
      id: crypto.randomUUID(),
      email: normalizedEmail,
      password: trimmedPassword,
      role: 'client',
      createdAt: new Date().toISOString(),
    }
    this.store.saveUsers([...users, user])

    this.customersController.create({
      name: trimmedName,
      email: normalizedEmail,
      phone: trimmedPhone,
    })

    this.store.saveSession({ userId: user.id })
    return { success: true, user }
  }

  logout() {
    this.store.clearSession()
  }
}
