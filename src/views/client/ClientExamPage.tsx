import { useState } from 'react'
import type { ClientController } from '../../controllers/ClientController'
import type { ClientExamHistory, ExamManagementSystem, ExamPaper } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { ReadOnlySection } from '../components/ReadOnlySection'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: ClientController
}

export function ClientExamPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  const modules = controllers.catalog.examModules()
  const papers = controllers.catalog.examPapers()
  const histories = controllers.clientExamHistories.list()

  return (
    <div className="grid gap-4">
      <ReadOnlySection<ExamManagementSystem>
        title="Exam modules (from Admin)"
        fields={[
          { key: 'id', label: 'Module ID' },
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
      />

      <ReadOnlySection<ExamPaper>
        title="Published exam papers (use Exam Paper ID below)"
        fields={[
          { key: 'id', label: 'Exam Paper ID' },
          { key: 'examModuleId', label: 'Exam Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'durationMinutes', label: 'Duration (min)' },
          { key: 'maxScore', label: 'Max score' },
          { key: 'description', label: 'Description' },
        ]}
        records={papers}
      />

      <CrudSection<ClientExamHistory>
        title="My Exam History"
        fields={[
          { key: 'examPaperId', label: 'Exam Paper ID' },
          { key: 'examModuleId', label: 'Exam Module ID' },
          { key: 'examName', label: 'Exam / attempt name' },
          { key: 'examDate', label: 'Date (YYYY-MM-DD)' },
          { key: 'score', label: 'Score', type: 'number' },
          { key: 'status', label: 'Status' },
          { key: 'notes', label: 'Notes' },
        ]}
        records={histories}
        onCreate={(payload) => {
          const created = controllers.clientExamHistories.create(payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'exam',
            action: 'exam_attempt_recorded',
            summary: `Recorded exam ${created.examName} (paper ${created.examPaperId})`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.clientExamHistories.update(id, payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'exam',
            action: 'exam_history_update',
            summary: `Updated exam history ${id}${updated ? ` (${updated.status})` : ''}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          controllers.clientExamHistories.remove(id)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'exam',
            action: 'exam_history_delete',
            summary: `Removed exam history ${id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
