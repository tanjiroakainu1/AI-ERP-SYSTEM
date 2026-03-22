import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { Order } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminOrdersPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const records = controllers.orders.list()

  return (
    <CrudSection<Order>
      title="Orders"
      fields={[
        { key: 'customerId', label: 'Customer ID' },
        { key: 'productId', label: 'Product ID' },
        { key: 'quantity', label: 'Qty', type: 'number' },
        { key: 'total', label: 'Total', type: 'number' },
        { key: 'status', label: 'Status' },
      ]}
      records={records}
      onCreate={(payload) => {
        const created = controllers.orders.create(payload)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'orders',
          action: 'create_order',
          summary: `Created order ${created.id} (status ${created.status})`,
          relatedEntityId: created.id,
        })
        refresh()
      }}
      onUpdate={(id, payload) => {
        const updated = controllers.orders.update(id, payload)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'orders',
          action: 'update_order',
          summary: `Updated order ${id}${updated ? ` → ${updated.status}` : ''}`,
          relatedEntityId: id,
        })
        refresh()
      }}
      onDelete={(id) => {
        controllers.orders.remove(id)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'orders',
          action: 'delete_order',
          summary: `Deleted order ${id}`,
          relatedEntityId: id,
        })
        refresh()
      }}
    />
  )
}
