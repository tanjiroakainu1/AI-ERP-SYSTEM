import { useState } from 'react'
import type { ActivityLog } from '../../types/erp'
import type { ActivityService } from '../../controllers/activityService'
import { ReadOnlySection } from '../components/ReadOnlySection'

interface Props {
  activity: ActivityService
}

export function AdminActivityPage({ activity }: Props) {
  const [tick, setTick] = useState(0)
  const refresh = () => setTick((t) => t + 1)
  const records = activity.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4" key={tick}>
      <div className="flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-cyan-500/20 bg-slate-950/55 px-4 py-3">
        <p className="min-w-0 flex-1 text-sm text-slate-300">
          Full audit trail across all modules (admin + client actions).
        </p>
        <button
          type="button"
          onClick={refresh}
          className="touch-manipulation shrink-0 rounded-lg border border-cyan-500/40 bg-cyan-600/80 px-3 py-2 text-xs font-semibold text-white hover:bg-cyan-500 sm:py-1.5"
        >
          Refresh
        </button>
      </div>
      <ReadOnlySection<ActivityLog>
        title="Activity / audit log"
        fields={[
          { key: 'createdAt', label: 'When' },
          { key: 'actorRole', label: 'Role' },
          { key: 'actorEmail', label: 'Actor' },
          { key: 'module', label: 'Module' },
          { key: 'action', label: 'Action' },
          { key: 'summary', label: 'Summary' },
          { key: 'relatedEntityId', label: 'Related ID' },
        ]}
        records={records}
      />
    </div>
  )
}
