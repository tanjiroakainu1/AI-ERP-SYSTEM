import { useState } from 'react'
import type { ClientController } from '../../controllers/ClientController'
import type {
  ClientElearningHistory,
  ELearningLesson,
  ELearningManagementSystem,
} from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { ReadOnlySection } from '../components/ReadOnlySection'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: ClientController
}

export function ClientElearningPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  const modules = controllers.catalog.elearningModules()
  const lessons = controllers.catalog.elearningLessons()
  const histories = controllers.clientElearningHistories.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <ReadOnlySection<ELearningManagementSystem>
        title="E-learning modules (from Admin)"
        fields={[
          { key: 'id', label: 'Module ID' },
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
      />

      <ReadOnlySection<ELearningLesson>
        title="Published lessons (use Lesson ID for progress)"
        fields={[
          { key: 'id', label: 'Lesson ID' },
          { key: 'elearningModuleId', label: 'E-learning Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'durationMinutes', label: 'Duration (min)' },
          { key: 'contentUrl', label: 'Content URL' },
          { key: 'summary', label: 'Summary' },
        ]}
        records={lessons}
      />

      <CrudSection<ClientElearningHistory>
        title="My E-learning Activity / History"
        fields={[
          { key: 'lessonId', label: 'Lesson ID' },
          { key: 'elearningModuleId', label: 'E-learning Module ID' },
          { key: 'activityTitle', label: 'Activity / lesson' },
          { key: 'progressPercent', label: 'Progress %', type: 'number' },
          { key: 'lastAccessed', label: 'Last accessed (YYYY-MM-DD)' },
          { key: 'notes', label: 'Notes' },
        ]}
        records={histories}
        onCreate={(payload) => {
          const created = controllers.clientElearningHistories.create(payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'elearning_progress_record',
            summary: `Started/updated lesson ${created.lessonId}: ${created.activityTitle}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.clientElearningHistories.update(id, payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'elearning_history_update',
            summary: `Updated e-learning history ${id}${updated ? ` (${updated.progressPercent}%)` : ''}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          controllers.clientElearningHistories.remove(id)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'elearning_history_delete',
            summary: `Removed e-learning history ${id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
