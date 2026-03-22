import { useState } from 'react'
import type { ClientController } from '../../controllers/ClientController'
import type { ClientLibraryHistory, LibraryBook, LibraryManagementSystem } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { ReadOnlySection } from '../components/ReadOnlySection'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: ClientController
}

export function ClientLibraryPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  const modules = controllers.catalog.libraryModules()
  const books = controllers.catalog.libraryBooks()
  const histories = controllers.clientLibraryHistories.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <ReadOnlySection<LibraryManagementSystem>
        title="Library modules (from Admin)"
        fields={[
          { key: 'id', label: 'Module ID' },
          { key: 'name', label: 'Module Name' },
          { key: 'owner', label: 'Owner' },
          { key: 'status', label: 'Status' },
          { key: 'description', label: 'Description' },
        ]}
        records={modules}
      />

      <ReadOnlySection<LibraryBook>
        title="Library catalog (use Book ID when borrowing)"
        fields={[
          { key: 'id', label: 'Book ID' },
          { key: 'libraryModuleId', label: 'Library Module ID' },
          { key: 'title', label: 'Title' },
          { key: 'author', label: 'Author' },
          { key: 'isbn', label: 'ISBN' },
          { key: 'copiesAvailable', label: 'Copies' },
        ]}
        records={books}
      />

      <CrudSection<ClientLibraryHistory>
        title="My Library History"
        fields={[
          { key: 'bookId', label: 'Book ID' },
          { key: 'libraryModuleId', label: 'Library Module ID' },
          { key: 'itemTitle', label: 'Item / title' },
          { key: 'borrowedAt', label: 'Borrowed (YYYY-MM-DD)' },
          { key: 'dueAt', label: 'Due (YYYY-MM-DD)' },
          { key: 'status', label: 'Status' },
          { key: 'notes', label: 'Notes' },
        ]}
        records={histories}
        onCreate={(payload) => {
          const created = controllers.clientLibraryHistories.create(payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'library',
            action: 'library_borrow_record',
            summary: `Library record for book ${created.bookId}: ${created.status}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.clientLibraryHistories.update(id, payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'library',
            action: 'library_history_update',
            summary: `Updated library history ${id}${updated ? ` (${updated.status})` : ''}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          controllers.clientLibraryHistories.remove(id)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'library',
            action: 'library_history_delete',
            summary: `Removed library history ${id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
