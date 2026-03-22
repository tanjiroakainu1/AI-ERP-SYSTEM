import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { CourseManagementSystem, CourseOffering } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminCoursePage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const modules = controllers.courseManagementSystems.list()
  const offerings = controllers.courseOfferings.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <CrudSection<CourseManagementSystem>
        title="Course management modules"
        fields={[
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
        onCreate={(payload) => {
          const created = controllers.courseManagementSystems.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'course',
            action: 'create_course_module',
            summary: `Created course module “${created.name}”`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.courseManagementSystems.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'course',
            action: 'update_course_module',
            summary: `Updated course module “${updated?.name ?? id}”`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.courseManagementSystems.getById(id)
          controllers.courseManagementSystems.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'course',
            action: 'delete_course_module',
            summary: `Deleted course module “${prev?.name ?? id}”`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />

      <CrudSection<CourseOffering>
        title="Course offerings (clients enroll by offering ID)"
        fields={[
          { key: 'courseModuleId', label: 'Course Module ID' },
          { key: 'code', label: 'Code' },
          { key: 'title', label: 'Title' },
          { key: 'instructor', label: 'Instructor' },
          { key: 'semester', label: 'Semester' },
          { key: 'capacity', label: 'Capacity', type: 'number' },
        ]}
        records={offerings}
        onCreate={(payload) => {
          const created = controllers.courseOfferings.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'course',
            action: 'add_course_offering',
            summary: `Added offering ${created.code} - ${created.title}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.courseOfferings.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'course',
            action: 'update_course_offering',
            summary: `Updated offering ${updated?.code ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.courseOfferings.getById(id)
          controllers.courseOfferings.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'course',
            action: 'delete_course_offering',
            summary: `Removed offering ${prev?.code ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
