import { useEffect, useState } from 'react'
import type { FormEvent } from 'react'
import type { AuthController } from '../controllers/AuthController'
import type { UserAccount } from '../types/auth'
import { SiteFooter } from './components/SiteFooter'

interface Props {
  auth: AuthController
  onAuthenticated: (user: UserAccount) => void
  /** Which tab to show when opening from the public home (Login vs Register). */
  initialAccessMode?: 'login' | 'register'
  /** Return visitors to the marketing home. */
  onBackToHome?: () => void
}

const field =
  'min-h-11 min-w-0 w-full rounded-xl border border-cyan-500/25 bg-slate-950/60 px-3 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/25'

export function AuthGateway({
  auth,
  onAuthenticated,
  initialAccessMode = 'login',
  onBackToHome,
}: Props) {
  const [mode, setMode] = useState<'login' | 'register'>(initialAccessMode)

  useEffect(() => {
    setMode(initialAccessMode)
  }, [initialAccessMode])
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(
    null,
  )
  const [showLoginPassword, setShowLoginPassword] = useState(false)
  const [showRegisterPassword, setShowRegisterPassword] = useState(false)
  const [showRegisterConfirmPassword, setShowRegisterConfirmPassword] = useState(false)
  const [loginData, setLoginData] = useState({ email: '', password: '' })
  const [registerData, setRegisterData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  })

  const submitLogin = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = auth.login(loginData.email.trim().toLowerCase(), loginData.password)
    if (!result.success || !result.user) {
      setMessage({ type: 'error', text: result.message ?? 'Login failed.' })
      return
    }
    setMessage({ type: 'success', text: 'Login successful. Redirecting...' })
    onAuthenticated(result.user)
  }

  const quickLogin = (role: 'admin' | 'client') => {
    const credentials =
      role === 'admin'
        ? { email: 'admin@gmail.com', password: 'admin123' }
        : { email: 'client@gmail.com', password: 'client123' }

    setLoginData(credentials)
    const result = auth.login(credentials.email, credentials.password)
    if (!result.success || !result.user) {
      setMessage({ type: 'error', text: result.message ?? 'Quick login failed.' })
      return
    }
    setMessage({
      type: 'success',
      text: `${role === 'admin' ? 'Admin' : 'Client'} quick login successful.`,
    })
    onAuthenticated(result.user)
  }

  const submitRegister = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const result = auth.registerClient({
      name: registerData.name,
      email: registerData.email,
      phone: registerData.phone,
      password: registerData.password,
      confirmPassword: registerData.confirmPassword,
    })
    if (!result.success || !result.user) {
      setMessage({ type: 'error', text: result.message ?? 'Registration failed.' })
      return
    }
    setMessage({ type: 'success', text: 'Registration successful. Redirecting...' })
    onAuthenticated(result.user)
  }

  const tabActive = 'border-cyan-400/60 bg-cyan-500/20 text-cyan-100 shadow-[0_0_20px_-4px_rgba(34,211,238,0.4)]'
  const tabIdle =
    'border-transparent bg-slate-900/50 text-slate-400 hover:border-cyan-500/20 hover:text-slate-200'

  const homeButtonClass =
    'touch-manipulation rounded-xl border border-slate-600/80 bg-slate-900/70 px-3 py-2.5 text-xs font-semibold text-slate-200 transition hover:border-cyan-500/40 hover:text-white sm:py-2'

  return (
    <div className="mx-auto w-full min-w-0 max-w-2xl rounded-2xl border border-cyan-500/25 bg-slate-950/60 p-4 shadow-[0_0_60px_-12px_rgba(34,211,238,0.35)] backdrop-blur-xl sm:p-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="bg-gradient-to-r from-cyan-200 to-violet-300 bg-clip-text text-xl font-bold text-transparent sm:text-2xl">
            Access
          </h2>
        </div>
        {onBackToHome && (
          <button type="button" onClick={onBackToHome} className={homeButtonClass}>
            Home
          </button>
        )}
      </div>
      <p className="mt-1 text-sm text-slate-400">Sign in or register as a client.</p>
      <p className="mt-2 text-xs text-slate-500">
        Demo: admin@gmail.com / admin123 · client@gmail.com / client123
      </p>

      <div className="mt-5 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => {
            setMode('login')
            setMessage(null)
          }}
          className={`touch-manipulation rounded-xl border px-4 py-2.5 text-sm font-semibold transition sm:py-2 ${mode === 'login' ? tabActive : tabIdle}`}
        >
          Login
        </button>
        <button
          type="button"
          onClick={() => {
            setMode('register')
            setMessage(null)
          }}
          className={`touch-manipulation rounded-xl border px-4 py-2.5 text-sm font-semibold transition sm:py-2 ${mode === 'register' ? tabActive : tabIdle}`}
        >
          Client Registration
        </button>
      </div>

      {mode === 'login' ? (
        <form className="mt-5 grid gap-3" onSubmit={submitLogin}>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              className="touch-manipulation rounded-xl border border-indigo-500/40 bg-indigo-600/80 px-3 py-2.5 text-xs font-semibold text-white hover:bg-indigo-500 sm:py-2"
              onClick={() => quickLogin('admin')}
            >
              Test Admin
            </button>
            <button
              type="button"
              className="touch-manipulation rounded-xl border border-emerald-500/40 bg-emerald-600/80 px-3 py-2.5 text-xs font-semibold text-white hover:bg-emerald-500 sm:py-2"
              onClick={() => quickLogin('client')}
            >
              Test Client
            </button>
          </div>
          <input
            required
            type="email"
            placeholder="Email"
            className={field}
            value={loginData.email}
            onChange={(event) =>
              setLoginData((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
            <input
              required
              type={showLoginPassword ? 'text' : 'password'}
              placeholder="Password"
              className={field}
              value={loginData.password}
              onChange={(event) =>
                setLoginData((prev) => ({ ...prev, password: event.target.value }))
              }
            />
            <button
              type="button"
              className="touch-manipulation rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 sm:py-2"
              onClick={() => setShowLoginPassword((v) => !v)}
            >
              {showLoginPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className="touch-manipulation min-h-11 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 py-3 text-sm font-bold text-white shadow-[0_0_28px_-4px_rgba(34,211,238,0.45)] transition hover:brightness-110"
          >
            Login
          </button>
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="text-sm text-slate-400 underline decoration-slate-600 underline-offset-4 hover:text-cyan-300"
            >
              Back to home
            </button>
          )}
        </form>
      ) : (
        <form className="mt-5 grid gap-3" onSubmit={submitRegister}>
          <input
            required
            type="text"
            placeholder="Full Name"
            className={field}
            value={registerData.name}
            onChange={(event) =>
              setRegisterData((prev) => ({ ...prev, name: event.target.value }))
            }
          />
          <input
            required
            type="email"
            placeholder="Email"
            className={field}
            value={registerData.email}
            onChange={(event) =>
              setRegisterData((prev) => ({ ...prev, email: event.target.value }))
            }
          />
          <input
            required
            type="text"
            placeholder="Phone"
            className={field}
            value={registerData.phone}
            onChange={(event) =>
              setRegisterData((prev) => ({ ...prev, phone: event.target.value }))
            }
          />
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
            <input
              required
              minLength={6}
              type={showRegisterPassword ? 'text' : 'password'}
              placeholder="Password (min 6 characters)"
              className={field}
              value={registerData.password}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, password: event.target.value }))
              }
            />
            <button
              type="button"
              className="touch-manipulation rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 sm:py-2"
              onClick={() => setShowRegisterPassword((v) => !v)}
            >
              {showRegisterPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <div className="grid grid-cols-1 gap-2 sm:grid-cols-[1fr_auto]">
            <input
              required
              minLength={6}
              type={showRegisterConfirmPassword ? 'text' : 'password'}
              placeholder="Confirm Password"
              className={field}
              value={registerData.confirmPassword}
              onChange={(event) =>
                setRegisterData((prev) => ({ ...prev, confirmPassword: event.target.value }))
              }
            />
            <button
              type="button"
              className="touch-manipulation rounded-xl border border-slate-600 bg-slate-800 px-3 py-2.5 text-xs font-semibold text-slate-200 hover:bg-slate-700 sm:py-2"
              onClick={() => setShowRegisterConfirmPassword((v) => !v)}
            >
              {showRegisterConfirmPassword ? 'Hide' : 'Show'}
            </button>
          </div>
          <button
            type="submit"
            className="touch-manipulation min-h-11 rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 py-3 text-sm font-bold text-white shadow-[0_0_28px_-4px_rgba(34,211,238,0.45)] transition hover:brightness-110"
          >
            Register Client
          </button>
          {onBackToHome && (
            <button
              type="button"
              onClick={onBackToHome}
              className="text-sm text-slate-400 underline decoration-slate-600 underline-offset-4 hover:text-cyan-300"
            >
              Back to home
            </button>
          )}
        </form>
      )}

      {message && (
        <p
          className={`mt-4 text-sm font-medium ${
            message.type === 'success' ? 'text-emerald-400' : 'text-rose-400'
          }`}
        >
          {message.text}
        </p>
      )}

      <SiteFooter variant="compact" className="mt-8" />
    </div>
  )
}
