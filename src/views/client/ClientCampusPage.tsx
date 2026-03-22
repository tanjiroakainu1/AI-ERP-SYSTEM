import { useState } from 'react'
import type { ClientController } from '../../controllers/ClientController'
import type { CampusManagementSystem, CampusTour, ClientCampusHistory } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { ReadOnlySection } from '../components/ReadOnlySection'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: ClientController
}

export function ClientCampusPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  const modules = controllers.catalog.campusModules()
  const tours = controllers.catalog.campusTours()
  const histories = controllers.clientCampusHistories.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <ReadOnlySection<CampusManagementSystem>
        title="Campus modules (from Admin)"
        fields={[
          { key: 'id', label: 'Module ID' },
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
      />

      <ReadOnlySection<CampusTour>
        title="Campus tours (use Tour ID to sign up)"
        fields={[
          { key: 'id', label: 'Tour ID' },
          { key: 'campusModuleId', label: 'Campus Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'tourDate', label: 'Tour date/time' },
          { key: 'meetingPoint', label: 'Meeting point' },
          { key: 'spotsAvailable', label: 'Spots' },
          { key: 'details', label: 'Details' },
        ]}
        records={tours}
      />

      <CrudSection<ClientCampusHistory>
        title="My Campus Tour Signups / History"
        fields={[
          { key: 'tourId', label: 'Tour ID' },
          { key: 'campusModuleId', label: 'Campus Module ID' },
          { key: 'tourTitle', label: 'Tour title' },
          { key: 'signupDate', label: 'Signup date (YYYY-MM-DD)' },
          { key: 'partySize', label: 'Party size', type: 'number' },
          { key: 'status', label: 'Status' },
          { key: 'notes', label: 'Notes' },
        ]}
        records={histories}
        onCreate={(payload) => {
          const created = controllers.clientCampusHistories.create(payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'campus',
            action: 'campus_tour_signup',
            summary: `Signed up for tour ${created.tourId}: ${created.tourTitle}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.clientCampusHistories.update(id, payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'campus',
            action: 'campus_history_update',
            summary: `Updated campus history ${id}${updated ? ` (${updated.status})` : ''}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          controllers.clientCampusHistories.remove(id)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'campus',
            action: 'campus_history_delete',
            summary: `Removed campus history ${id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
