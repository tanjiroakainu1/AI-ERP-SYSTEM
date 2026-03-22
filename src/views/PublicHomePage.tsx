import { APP_NAME } from '../constants/siteMeta'
import { SiteFooter } from './components/SiteFooter'

interface Props {
  onLogin: () => void
  onRegister: () => void
}

const features = [
  { title: 'Commerce', desc: 'Product catalog, orders, and customer records.' },
  { title: 'Exams & courses', desc: 'Published papers, enrollments, and academic bulletins.' },
  { title: 'Campus & library', desc: 'Tours, facilities context, and book borrowing.' },
  { title: 'E-learning', desc: 'Lessons and progress tracking for learners.' },
  { title: 'Audit trail', desc: 'Activity logs for admins and clients per module.' },
]

export function PublicHomePage({ onLogin, onRegister }: Props) {
  return (
    <div className="mx-auto min-w-0 max-w-4xl">
      <section className="rounded-2xl border border-cyan-500/25 bg-slate-950/55 p-4 shadow-[0_0_60px_-12px_rgba(34,211,238,0.3)] backdrop-blur-xl sm:p-8 md:p-10">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-cyan-400/80">
          Welcome
        </p>
        <h2 className="mt-2 bg-gradient-to-r from-cyan-200 via-white to-violet-300 bg-clip-text text-2xl font-bold tracking-tight text-transparent sm:text-3xl md:text-4xl">
          {APP_NAME}
        </h2>
        <p className="mt-4 max-w-2xl text-base leading-relaxed text-slate-300 sm:text-lg">
          A unified portal for your organization: administrators configure modules and catalogs;
          clients order, learn, borrow, join tours, and manage their own activity - all in one
          place.
        </p>

        <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <button
            type="button"
            onClick={onLogin}
            className="touch-manipulation rounded-xl bg-gradient-to-r from-cyan-600 to-violet-600 px-6 py-3.5 text-sm font-bold text-white shadow-[0_0_28px_-4px_rgba(34,211,238,0.45)] transition hover:brightness-110"
          >
            Login
          </button>
          <button
            type="button"
            onClick={onRegister}
            className="touch-manipulation rounded-xl border border-violet-500/45 bg-violet-600/25 px-6 py-3.5 text-sm font-bold text-violet-100 shadow-[0_0_20px_-4px_rgba(139,92,246,0.35)] transition hover:border-violet-400/60 hover:bg-violet-600/35"
          >
            Register (client)
          </button>
        </div>
      </section>

      <section className="mt-6 grid gap-3 sm:grid-cols-2 sm:mt-8 md:gap-4">
        {features.map((f) => (
          <article
            key={f.title}
            className="rounded-2xl border border-slate-700/60 bg-slate-950/40 p-4 backdrop-blur-sm transition hover:border-cyan-500/25"
          >
            <h3 className="text-sm font-semibold text-cyan-200">{f.title}</h3>
            <p className="mt-1 text-sm text-slate-400">{f.desc}</p>
          </article>
        ))}
      </section>

      <SiteFooter variant="prominent" />
    </div>
  )
}
