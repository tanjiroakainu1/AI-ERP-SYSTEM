import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { LibraryBook, LibraryManagementSystem } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminLibraryPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const modules = controllers.libraryManagementSystems.list()
  const books = controllers.libraryBooks.list()

  return (
    <div className="grid gap-4">
      <CrudSection<LibraryManagementSystem>
        title="Library management modules"
        fields={[
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
        onCreate={(payload) => {
          const created = controllers.libraryManagementSystems.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'library',
            action: 'create_library_module',
            summary: `Created library module ${created.name}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.libraryManagementSystems.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'library',
            action: 'update_library_module',
            summary: `Updated library module ${updated?.name ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.libraryManagementSystems.getById(id)
          controllers.libraryManagementSystems.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'library',
            action: 'delete_library_module',
            summary: `Deleted library module ${prev?.name ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />

      <CrudSection<LibraryBook>
        title="Library catalog (clients borrow by book ID)"
        fields={[
          { key: 'libraryModuleId', label: 'Library Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'author', label: 'Author' },
          { key: 'isbn', label: 'ISBN' },
          { key: 'copiesAvailable', label: 'Copies', type: 'number' },
        ]}
        records={books}
        onCreate={(payload) => {
          const created = controllers.libraryBooks.create(payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'library',
            action: 'add_library_book',
            summary: `Added book ${created.title}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.libraryBooks.update(id, payload)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'library',
            action: 'update_library_book',
            summary: `Updated book ${updated?.title ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          const prev = controllers.libraryBooks.getById(id)
          controllers.libraryBooks.remove(id)
          activity.log({
            actorRole: 'admin',
            actorEmail: userEmail,
            module: 'library',
            action: 'delete_library_book',
            summary: `Removed book ${prev?.title ?? id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
