import { ErpStore } from '../models/ErpStore'
import { CrudController } from './CrudController'
import type { ActivityLog } from '../types/erp'

export interface ActivityService {
  log(input: {
    actorRole: 'admin' | 'client'
    actorEmail: string
    module: string
    action: string
    summary: string
    relatedEntityId?: string
  }): void
  list(): ActivityLog[]
}

export function createActivityService(store: ErpStore): ActivityService {
  const c = new CrudController<ActivityLog, 'activityLogs'>(store, 'activityLogs')
  return {
    log(input) {
      c.create({
        actorRole: input.actorRole,
        actorEmail: input.actorEmail,
        module: input.module,
        action: input.action,
        summary: input.summary,
        relatedEntityId: input.relatedEntityId ?? '',
      })
    },
    list() {
      return [...c.list()].sort(
        (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
      )
    },
  }
}
