import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { ExamManagementSystem, ExamPaper } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminExamPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const modules = controllers.examManagementSystems.list()
  const papers = controllers.examPapers.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <CrudSection<ExamManagementSystem>
        title="Exam management modules"
        fields={[
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
        onCreate={(payload) => {
          const created = controllers.examManagementSystems.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'exam',
            action: 'create_exam_module',
            summary: `Created exam module ${created.name}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.examManagementSystems.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'exam',
            action: 'update_exam_module',
            summary: `Updated exam module ${updated?.name ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.examManagementSystems.getById(id)
          controllers.examManagementSystems.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'exam',
            action: 'delete_exam_module',
            summary: `Deleted exam module ${prev?.name ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />

      <CrudSection<ExamPaper>
        title="Exam papers (clients take these)"
        fields={[
          { key: 'examModuleId', label: 'Exam Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'durationMinutes', label: 'Duration (min)', type: 'number' },
          { key: 'maxScore', label: 'Max score', type: 'number' },
          { key: 'description', label: 'Description' },
        ]}
        records={papers}
        onCreate={(payload) => {
          const created = controllers.examPapers.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'exam',
            action: 'publish_exam_paper',
            summary: `Published exam ${created.title}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.examPapers.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'exam',
            action: 'update_exam_paper',
            summary: `Updated exam ${updated?.title ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.examPapers.getById(id)
          controllers.examPapers.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'exam',
            action: 'delete_exam_paper',
            summary: `Removed exam ${prev?.title ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
