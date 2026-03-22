import { useMemo, useState } from 'react'
import { AdminDashboard } from './views/AdminDashboard'
import { ClientDashboard } from './views/ClientDashboard'
import { AuthGateway } from './views/AuthGateway'
import { PublicHomePage } from './views/PublicHomePage'
import { ErpControllerFactory } from './controllers/ErpControllerFactory'
import type { UserAccount } from './types/auth'
import { APP_NAME } from './constants/siteMeta'
import { FloatingChatbot } from './views/components/FloatingChatbot'
import { LightningBackdrop } from './views/components/LightningBackdrop'
import { SiteFooter } from './views/components/SiteFooter'

type GuestScreen = 'home' | 'auth'

export function App() {
  const controllers = useMemo(() => ErpControllerFactory.create(), [])
  const [user, setUser] = useState<UserAccount | null>(() => controllers.auth.getCurrentUser())
  const [guestScreen, setGuestScreen] = useState<GuestScreen>('home')
  const [authEntry, setAuthEntry] = useState<'login' | 'register'>('login')

  const logout = () => {
    controllers.auth.logout()
    setUser(null)
    setGuestScreen('home')
    setAuthEntry('login')
  }

  return (
    <>
      <LightningBackdrop />
      <main className="relative z-10 min-h-dvh min-w-0 overflow-x-clip px-3 py-4 pb-[max(1.25rem,env(safe-area-inset-bottom,0px))] text-slate-100 sm:px-4 sm:py-8">
        <div className="mx-auto min-w-0 max-w-7xl">
          <header className="mb-4 rounded-2xl border border-cyan-500/25 bg-slate-950/60 p-3 shadow-[0_0_50px_-12px_rgba(34,211,238,0.35)] backdrop-blur-xl sm:mb-6 sm:p-5">
            <h1 className="bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-xl font-bold tracking-tight text-transparent sm:text-2xl md:text-3xl">
              {APP_NAME}
            </h1>
            {user && (
              <div className="mt-3 flex flex-col gap-3 sm:mt-4 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 break-words text-sm text-slate-300 sm:break-normal">
                  <span className="block sm:inline">Logged in as </span>
                  <span className="font-semibold text-cyan-200">{user.email}</span>{' '}
                  <span className="text-violet-300">({user.role})</span>
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="touch-manipulation rounded-xl border border-rose-500/40 bg-rose-600/90 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(244,63,94,0.5)] transition hover:bg-rose-500 sm:py-2"
                >
                  Logout
                </button>
              </div>
            )}
          </header>
        {!user ? (
          guestScreen === 'home' ? (
            <PublicHomePage
              onLogin={() => {
                setAuthEntry('login')
                setGuestScreen('auth')
              }}
              onRegister={() => {
                setAuthEntry('register')
                setGuestScreen('auth')
              }}
            />
          ) : (
            <AuthGateway
              auth={controllers.auth}
              onAuthenticated={setUser}
              initialAccessMode={authEntry}
              onBackToHome={() => setGuestScreen('home')}
            />
          )
        ) : user.role === 'admin' ? (
          <AdminDashboard
            controllers={controllers.admin}
            activity={controllers.activity}
            userEmail={user.email}
          />
        ) : (
          <ClientDashboard
            controllers={controllers.client}
            activity={controllers.activity}
            userEmail={user.email}
          />
        )}
        {user && <SiteFooter variant="compact" className="mx-auto mt-10 max-w-7xl px-1" />}
        </div>
        <FloatingChatbot />
      </main>
    </>
  )
}
