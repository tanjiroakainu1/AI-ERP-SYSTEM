import { ErpStore } from '../models/ErpStore'
import type { BaseEntity, EntityType, ErpState } from '../types/erp'

type CreateInput<T extends BaseEntity> = Omit<T, 'id' | 'createdAt' | 'updatedAt'>
type UpdateInput<T extends BaseEntity> = Partial<CreateInput<T>>

export class CrudController<T extends BaseEntity, K extends EntityType> {
  private readonly store: ErpStore
  private readonly key: K

  constructor(store: ErpStore, key: K) {
    this.store = store
    this.key = key
  }

  list(): T[] {
    return this.store.getState()[this.key] as unknown as T[]
  }

  getById(id: string): T | undefined {
    return this.list().find((item) => item.id === id)
  }

  create(data: CreateInput<T>): T {
    const entity = {
      ...data,
      id: crypto.randomUUID(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    } as T
    this.write((state) => ({
      ...state,
      [this.key]: [...state[this.key], entity],
    }))
    return entity
  }

  update(id: string, data: UpdateInput<T>): T | undefined {
    let updated: T | undefined
    this.write((state) => ({
      ...state,
      [this.key]: state[this.key].map((item) => {
        if (item.id !== id) {
          return item
        }
        updated = {
          ...item,
          ...data,
          updatedAt: new Date().toISOString(),
        } as unknown as T
        return updated
      }),
    }))
    return updated
  }

  remove(id: string): boolean {
    const existing = this.getById(id)
    if (!existing) {
      return false
    }
    this.write((state) => ({
      ...state,
      [this.key]: state[this.key].filter((item) => item.id !== id),
    }))
    return true
  }

  private write(transform: (state: ErpState) => ErpState): void {
    const state = this.store.getState()
    const next = transform(state)
    this.store.updateState(next)
  }
}
