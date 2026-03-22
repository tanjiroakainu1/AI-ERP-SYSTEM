import { useState } from 'react'
import type { ClientController } from '../../controllers/ClientController'
import type { ClientProductHistory, Product } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { ReadOnlySection } from '../components/ReadOnlySection'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: ClientController
}

export function ClientProductsPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)

  const catalog = controllers.catalog.products()
  const histories = controllers.clientProductHistories.list()

  return (
    <div className="grid min-w-0 gap-3 md:gap-4">
      <ReadOnlySection<Product>
        title="Product Catalog (from Admin)"
        fields={[
          { key: 'id', label: 'Product ID' },
          { key: 'name', label: 'Name' },
          { key: 'sku', label: 'SKU' },
          { key: 'price', label: 'Price' },
          { key: 'stock', label: 'Stock' },
        ]}
        records={catalog}
      />

      <CrudSection<ClientProductHistory>
        title="My Product Activity / History"
        fields={[
          { key: 'productId', label: 'Product ID' },
          { key: 'action', label: 'Action (inquiry, wishlist, ...)' },
          { key: 'quantity', label: 'Qty', type: 'number' },
          { key: 'notes', label: 'Notes' },
        ]}
        records={histories}
        onCreate={(payload) => {
          const created = controllers.clientProductHistories.create(payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'products',
            action: 'product_history_create',
            summary: `Recorded ${created.action} for product ${created.productId}`,
            relatedEntityId: created.id,
          })
          refresh()
        }}
        onUpdate={(id, payload) => {
          const updated = controllers.clientProductHistories.update(id, payload)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'products',
            action: 'product_history_update',
            summary: `Updated product activity ${id}${updated ? ` (${updated.action})` : ''}`,
            relatedEntityId: id,
          })
          refresh()
        }}
        onDelete={(id) => {
          controllers.clientProductHistories.remove(id)
          activity.log({
            actorRole: 'client',
            actorEmail: userEmail,
            module: 'products',
            action: 'product_history_delete',
            summary: `Removed product activity ${id}`,
            relatedEntityId: id,
          })
          refresh()
        }}
      />
    </div>
  )
}
