import { useState } from 'react'
import type { ClientController } from '../../controllers/ClientController'
import type {
  ClientCourseHistory,
  CourseManagementSystem,
  CourseOffering,
} from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { ReadOnlySection } from '../components/ReadOnlySection'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: ClientController
}

export function ClientCoursePage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  const modules = controllers.catalog.courseModules()
  const offerings = controllers.catalog.courseOfferings()
  const histories = controllers.clientCourseHistories.list()

  return (
    <div className="grid gap-4">
      <ReadOnlySection<CourseManagementSystem>
        title="Course modules (from Admin)"
        fields={[
          { key: 'id', label: 'Module ID' },
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
      />

      <ReadOnlySection<CourseOffering>
        title="Course offerings (use Offering ID to enroll)"
        fields={[
          { key: 'id', label: 'Offering ID' },
          { key: 'courseModuleId', label: 'Course Module ID' },
          { key: 'code', label: 'Code' },
          { key: 'title', label: 'Title' },
          { key: 'instructor', label: 'Instructor' },
          { key: 'semester', label: 'Semester' },
          { key: 'capacity', label: 'Capacity' },
        ]}
        records={offerings}
      />

      <CrudSection<ClientCourseHistory>
        title="My Course Enrollment / History"
        fields={[
          { key: 'offeringId', label: 'Offering ID' },
          { key: 'courseModuleId', label: 'Course Module ID' },
          { key: 'courseName', label: 'Course name' },
          { key: 'enrollmentStatus', label: 'Enrollment status' },
          { key: 'enrolledAt', label: 'Enrolled (YYYY-MM-DD)' },
          { key: 'notes', label: 'Notes' },
        ]}
        records={histories}
        onCreate={(payload) => {
          const created = controllers.clientCourseHistories.create(payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'course',
            action: 'course_enrollment_record',
            summary: `Enrollment ${created.enrollmentStatus} for offering ${created.offeringId}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.clientCourseHistories.update(id, payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'course',
            action: 'course_history_update',
            summary: `Updated course history ${id}${updated ? ` (${updated.enrollmentStatus})` : ''}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          controllers.clientCourseHistories.remove(id)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'course',
            action: 'course_history_delete',
            summary: `Removed course history ${id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
