import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { ELearningLesson, ELearningManagementSystem } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminElearningPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const modules = controllers.elearningManagementSystems.list()
  const lessons = controllers.elearningLessons.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <CrudSection<ELearningManagementSystem>
        title="E-learning management modules"
        fields={[
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
        onCreate={(payload) => {
          const created = controllers.elearningManagementSystems.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'create_elearning_module',
            summary: `Created e-learning module ${created.name}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.elearningManagementSystems.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'update_elearning_module',
            summary: `Updated e-learning module ${updated?.name ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.elearningManagementSystems.getById(id)
          controllers.elearningManagementSystems.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'delete_elearning_module',
            summary: `Deleted e-learning module ${prev?.name ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />

      <CrudSection<ELearningLesson>
        title="Lessons / units (clients study by lesson ID)"
        fields={[
          { key: 'elearningModuleId', label: 'E-learning Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'durationMinutes', label: 'Duration (min)', type: 'number' },
          { key: 'contentUrl', label: 'Content URL' },
          { key: 'summary', label: 'Summary' },
        ]}
        records={lessons}
        onCreate={(payload) => {
          const created = controllers.elearningLessons.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'add_elearning_lesson',
            summary: `Published lesson ${created.title}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.elearningLessons.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'update_elearning_lesson',
            summary: `Updated lesson ${updated?.title ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.elearningLessons.getById(id)
          controllers.elearningLessons.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'elearning',
            action: 'delete_elearning_lesson',
            summary: `Removed lesson ${prev?.title ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
