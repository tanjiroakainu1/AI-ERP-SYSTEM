import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { CampusManagementSystem, CampusTour } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminCampusPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const modules = controllers.campusManagementSystems.list()
  const tours = controllers.campusTours.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <CrudSection<CampusManagementSystem>
        title="Campus management modules"
        fields={[
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
        onCreate={(payload) => {
          const created = controllers.campusManagementSystems.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'campus',
            action: 'create_campus_module',
            summary: `Created campus module ${created.name}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.campusManagementSystems.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'campus',
            action: 'update_campus_module',
            summary: `Updated campus module ${updated?.name ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.campusManagementSystems.getById(id)
          controllers.campusManagementSystems.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'campus',
            action: 'delete_campus_module',
            summary: `Deleted campus module ${prev?.name ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />

      <CrudSection<CampusTour>
        title="Campus tours (clients sign up by tour ID)"
        fields={[
          { key: 'campusModuleId', label: 'Campus Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'tourDate', label: 'Tour date/time (ISO)' },
          { key: 'meetingPoint', label: 'Meeting point' },
          { key: 'spotsAvailable', label: 'Spots', type: 'number' },
          { key: 'details', label: 'Details' },
        ]}
        records={tours}
        onCreate={(payload) => {
          const created = controllers.campusTours.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'campus',
            action: 'add_campus_tour',
            summary: `Added tour ${created.title}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.campusTours.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'campus',
            action: 'update_campus_tour',
            summary: `Updated tour ${updated?.title ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.campusTours.getById(id)
          controllers.campusTours.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'campus',
            action: 'delete_campus_tour',
            summary: `Removed tour ${prev?.title ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
