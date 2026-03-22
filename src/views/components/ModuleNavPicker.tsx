import type { ReactNode } from 'react'

export interface ModuleNavItem<K extends string = string> {
  key: K
  label: string
}

interface Props<K extends string> {
  /** Unique id for the mobile select (accessibility). */
  id: string
  heading: string
  description?: ReactNode
  pages: ModuleNavItem<K>[]
  active: K
  onSelect: (key: K) => void
  variant: 'admin' | 'client'
}

export function ModuleNavPicker<K extends string>({
  id,
  heading,
  description,
  pages,
  active,
  onSelect,
  variant,
}: Props<K>) {
  const isAdmin = variant === 'admin'

  const sectionClass = isAdmin
    ? 'min-w-0 max-w-full rounded-2xl border border-cyan-500/25 bg-slate-950/55 p-3 shadow-[0_0_40px_-12px_rgba(34,211,238,0.25)] backdrop-blur-xl sm:p-5'
    : 'min-w-0 max-w-full rounded-2xl border border-violet-500/25 bg-slate-950/55 p-3 shadow-[0_0_40px_-12px_rgba(139,92,246,0.22)] backdrop-blur-xl sm:p-5'

  const titleClass = isAdmin ? 'text-base font-semibold text-cyan-100 sm:text-lg' : 'text-base font-semibold text-violet-100 sm:text-lg'

  const selectClass = isAdmin
    ? 'w-full min-h-[3rem] cursor-pointer appearance-none rounded-xl border border-cyan-500/35 bg-slate-950/90 px-3 py-2 pr-10 text-sm font-medium text-slate-100 shadow-inner outline-none transition focus:border-cyan-400/70 focus:ring-2 focus:ring-cyan-500/30'
    : 'w-full min-h-[3rem] cursor-pointer appearance-none rounded-xl border border-violet-500/35 bg-slate-950/90 px-3 py-2 pr-10 text-sm font-medium text-slate-100 shadow-inner outline-none transition focus:border-violet-400/70 focus:ring-2 focus:ring-violet-500/30'

  const activeBtn = isAdmin
    ? 'border-cyan-400/50 bg-gradient-to-r from-cyan-600/40 to-violet-600/40 text-white shadow-[0_0_20px_-4px_rgba(34,211,238,0.35)]'
    : 'border-violet-400/50 bg-gradient-to-r from-violet-600/40 to-cyan-600/35 text-white shadow-[0_0_20px_-4px_rgba(139,92,246,0.35)]'

  const idleBtn = 'border-slate-700/80 bg-slate-900/60 text-slate-300 hover:border-slate-600 hover:text-white'

  return (
    <section className={sectionClass}>
      <h2 className={titleClass}>{heading}</h2>
      {description ? (
        <div className="mt-1 text-xs leading-relaxed text-slate-400 sm:text-sm">{description}</div>
      ) : null}

      <div className="mt-3 sm:mt-4">
        <label htmlFor={id} className="sr-only">
          Choose module
        </label>
        {/* Phones / narrow tablets: single control — no cramped wrap */}
        <select
          id={id}
          value={active}
          onChange={(e) => onSelect(e.target.value as K)}
          className={`${selectClass} md:hidden`}
        >
          {pages.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
            </option>
          ))}
        </select>

        {/* md+: horizontal scroll — all modules stay one row, thumb-friendly */}
        <div
          className="hidden md:flex md:flex-nowrap md:gap-2 md:overflow-x-auto md:overflow-y-visible md:py-1 md:pl-0.5 md:pr-1 touch-scroll-x [scrollbar-width:thin]"
          role="tablist"
          aria-label="Modules"
        >
          {pages.map((page) => (
            <button
              key={page.key}
              type="button"
              role="tab"
              aria-selected={active === page.key}
              onClick={() => onSelect(page.key)}
              className={`touch-manipulation shrink-0 snap-start rounded-xl border px-3 py-2.5 text-left text-sm font-semibold leading-snug transition first:ml-0 ${
                active === page.key ? activeBtn : idleBtn
              }`}
            >
              {page.label}
            </button>
          ))}
        </div>
      </div>
    </section>
  )
}
