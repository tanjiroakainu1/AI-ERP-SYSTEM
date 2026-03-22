import type { ActivityService } from '../controllers/activityService'

/** Passed from dashboards so modules can append audit rows via `activity.log`. */
export interface AuditProps {
  activity: ActivityService
  userEmail: string
}
