import { useState } from 'react'
import type { ClientController } from '../../controllers/ClientController'
import type { Customer, Order, Product } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { ReadOnlySection } from '../components/ReadOnlySection'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: ClientController
}

export function ClientOrdersPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  const customers = controllers.catalog.customers()
  const products = controllers.catalog.products()
  const orders = controllers.orders.list()

  return (
    <div className="grid gap-4">
      <ReadOnlySection<Customer>
        title="Reference: Customers (your Customer ID)"
        fields={[
          { key: 'id', label: 'Customer ID' },
          { key: 'name', label: 'Name' },
          { key: 'email', label: 'Email' },
        ]}
        records={customers}
      />

      <ReadOnlySection<Product>
        title="Reference: Products (IDs from Admin)"
        fields={[
          { key: 'id', label: 'Product ID' },
          { key: 'name', label: 'Name' },
          { key: 'sku', label: 'SKU' },
          { key: 'price', label: 'Price' },
        ]}
        records={products}
      />

      <CrudSection<Order>
        title="My Orders (history & new orders)"
        fields={[
          { key: 'customerId', label: 'Customer ID' },
          { key: 'productId', label: 'Product ID' },
          { key: 'quantity', label: 'Qty', type: 'number' },
          { key: 'total', label: 'Total', type: 'number' },
          { key: 'status', label: 'Status' },
        ]}
        records={orders}
        onCreate={(payload) => {
          const created = controllers.orders.create(payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'orders',
            action: 'place_order',
            summary: `Placed order ${created.id} (${created.quantity}x product ${created.productId})`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.orders.update(id, payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'orders',
            action: 'update_order',
            summary: `Updated order ${id}${updated ? ` status ${updated.status}` : ''}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          controllers.orders.remove(id)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'orders',
            action: 'delete_order',
            summary: `Removed order ${id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
