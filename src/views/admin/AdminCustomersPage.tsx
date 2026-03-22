import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { Customer } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminCustomersPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const records = controllers.customers.list()

  return (
    <CrudSection<Customer>
      title="Customers"
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'email', label: 'Email', type: 'email' },
        { key: 'phone', label: 'Phone' },
      ]}
      records={records}
      onCreate={(payload) => {
        const created = controllers.customers.create(payload)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'customers',
          action: 'create_customer',
          summary: `Added customer ${created.name} (${created.email})`,
          relatedEntityId: created.id,
        })
        refresh()
      }}
      onUpdate={(id, payload) => {
        const updated = controllers.customers.update(id, payload)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'customers',
          action: 'update_customer',
          summary: `Updated customer ${updated?.name ?? id}`,
          relatedEntityId: id,
        })
        refresh()
      }}
      onDelete={(id) => {
        const prev = controllers.customers.getById(id)
        controllers.customers.remove(id)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'customers',
          action: 'delete_customer',
          summary: `Deleted customer ${prev?.name ?? id}`,
          relatedEntityId: id,
        })
        refresh()
      }}
    />
  )
}
