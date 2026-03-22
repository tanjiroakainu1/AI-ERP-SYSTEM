import { DEVELOPER_NAME, DEVELOPER_ROLE } from '../../constants/siteMeta'

type Variant = 'prominent' | 'compact'

interface Props {
  variant?: Variant
  className?: string
}

export function SiteFooter({ variant = 'compact', className = '' }: Props) {
  if (variant === 'prominent') {
    return (
      <footer
        className={`mt-10 rounded-2xl border border-violet-500/20 bg-slate-950/50 px-4 py-5 text-center backdrop-blur-sm sm:px-6 ${className}`}
      >
        <p className="break-words px-1 text-sm text-slate-400">
          <span className="font-semibold text-violet-200/90">{DEVELOPER_ROLE}</span>
          <span className="mx-2 text-slate-600">·</span>
          <span className="text-cyan-200/90">{DEVELOPER_NAME}</span>
        </p>
        <p className="mt-1 text-xs text-slate-500">Built for admin operations and client self-service.</p>
      </footer>
    )
  }

  return (
    <footer className={`border-t border-slate-800/80 pt-4 text-center text-xs text-slate-500 ${className}`}>
      {DEVELOPER_ROLE}: <span className="font-medium text-slate-400">{DEVELOPER_NAME}</span>
    </footer>
  )
}
