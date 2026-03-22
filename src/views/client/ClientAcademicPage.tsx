import { useState } from 'react'
import type { ClientController } from '../../controllers/ClientController'
import type {
  AcademicBulletin,
  AcademicManagementSystem,
  ClientAcademicHistory,
} from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { ReadOnlySection } from '../components/ReadOnlySection'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: ClientController
}

export function ClientAcademicPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  const modules = controllers.catalog.academicModules()
  const bulletins = controllers.catalog.academicBulletins()
  const histories = controllers.clientAcademicHistories.list()

  return (
    <div className="grid gap-4">
      <ReadOnlySection<AcademicManagementSystem>
        title="Academic modules (from Admin)"
        fields={[
          { key: 'id', label: 'Module ID' },
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
      />

      <ReadOnlySection<AcademicBulletin>
        title="Academic bulletins (reference Bulletin ID)"
        fields={[
          { key: 'id', label: 'Bulletin ID' },
          { key: 'academicModuleId', label: 'Academic Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'category', label: 'Category' },
          { key: 'body', label: 'Body' },
        ]}
        records={bulletins}
      />

      <CrudSection<ClientAcademicHistory>
        title="My Academic Records / History"
        fields={[
          { key: 'bulletinId', label: 'Bulletin ID' },
          { key: 'academicModuleId', label: 'Academic Module ID' },
          { key: 'recordType', label: 'Record type' },
          { key: 'term', label: 'Term' },
          { key: 'value', label: 'Value / status' },
          { key: 'notes', label: 'Notes' },
        ]}
        records={histories}
        onCreate={(payload) => {
          const created = controllers.clientAcademicHistories.create(payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'academic',
            action: 'academic_record_create',
            summary: `Academic record ${created.recordType} (bulletin ${created.bulletinId})`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.clientAcademicHistories.update(id, payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'academic',
            action: 'academic_history_update',
            summary: `Updated academic history ${id}${updated ? ` (${updated.value})` : ''}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          controllers.clientAcademicHistories.remove(id)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'academic',
            action: 'academic_history_delete',
            summary: `Removed academic history ${id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
