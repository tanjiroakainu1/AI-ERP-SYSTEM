import { useState } from 'react'
import type { AdminController } from '../../controllers/AdminController'
import type { Product } from '../../types/erp'
import type { AuditProps } from '../auditProps'
import { CrudSection } from '../components/CrudSection'

interface Props extends AuditProps {
  controllers: AdminController
}

export function AdminProductsPage({ controllers, activity, userEmail }: Props) {
  const [, setVersion] = useState(0)
  const refresh = () => setVersion((v) => v + 1)
  const records = controllers.products.list()

  return (
    <CrudSection<Product>
      title="Products"
      fields={[
        { key: 'name', label: 'Name' },
        { key: 'sku', label: 'SKU' },
        { key: 'price', label: 'Price', type: 'number' },
        { key: 'stock', label: 'Stock', type: 'number' },
      ]}
      records={records}
      onCreate={(payload) => {
        const created = controllers.products.create(payload)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'products',
          action: 'create_product',
          summary: `Added product ${created.name}`,
          relatedEntityId: created.id,
        })
        refresh()
      }}
      onUpdate={(id, payload) => {
        const updated = controllers.products.update(id, payload)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'products',
          action: 'update_product',
          summary: `Updated product ${updated?.name ?? id}`,
          relatedEntityId: id,
        })
        refresh()
      }}
      onDelete={(id) => {
        const prev = controllers.products.getById(id)
        controllers.products.remove(id)
        activity.log({
          actorRole: 'admin',
          actorEmail: userEmail,
          module: 'products',
          action: 'delete_product',
          summary: `Deleted product ${prev?.name ?? id}`,
          relatedEntityId: id,
        })
        refresh()
      }}
    />
  )
}
