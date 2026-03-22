import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { AcademicBulletin, AcademicManagementSystem } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminAcademicPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const modules = controllers.academicManagementSystems.list()
  const bulletins = controllers.academicBulletins.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <CrudSection<AcademicManagementSystem>
        title="Academic management modules"
        fields={[
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
        onCreate={(payload) => {
          const created = controllers.academicManagementSystems.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'academic',
            action: 'create_academic_module',
            summary: `Created academic module "${created.name}"`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.academicManagementSystems.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'academic',
            action: 'update_academic_module',
            summary: `Updated academic module "${updated?.name ?? id}"`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.academicManagementSystems.getById(id)
          controllers.academicManagementSystems.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'academic',
            action: 'delete_academic_module',
            summary: `Deleted academic module "${prev?.name ?? id}"`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />

      <CrudSection<AcademicBulletin>
        title="Bulletins and notices (clients reference by bulletin ID)"
        fields={[
          { key: 'academicModuleId', label: 'Academic Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'category', label: 'Category' },
          { key: 'body', label: 'Body' },
        ]}
        records={bulletins}
        onCreate={(payload) => {
          const created = controllers.academicBulletins.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'academic',
            action: 'add_academic_bulletin',
            summary: `Posted bulletin "${created.title}"`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.academicBulletins.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'academic',
            action: 'update_academic_bulletin',
            summary: `Updated bulletin "${updated?.title ?? id}"`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.academicBulletins.getById(id)
          controllers.academicBulletins.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'academic',
            action: 'delete_academic_bulletin',
            summary: `Removed bulletin "${prev?.title ?? id}"`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
