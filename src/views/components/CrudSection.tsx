import { useState } from 'react'
import type { FormEvent } from 'react'
import type { BaseEntity } from '../../types/erp'

interface FieldConfig<T> {
  key: keyof T
  label: string
  type?: 'text' | 'number' | 'email'
}

interface CrudSectionProps<T extends BaseEntity> {
  title: string
  fields: FieldConfig<T>[]
  records: T[]
  onCreate: (payload: Omit<T, 'id' | 'createdAt' | 'updatedAt'>) => void
  onUpdate: (id: string, payload: Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>) => void
  onDelete: (id: string) => void
}

const inputClass =
  'min-h-11 min-w-0 w-full rounded-lg border border-cyan-500/25 bg-slate-950/60 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-500 focus:border-cyan-400/70 focus:outline-none focus:ring-2 focus:ring-cyan-500/25 sm:min-h-0'

export function CrudSection<T extends BaseEntity>({
  title,
  fields,
  records,
  onCreate,
  onUpdate,
  onDelete,
}: CrudSectionProps<T>) {
  const [editId, setEditId] = useState<string | null>(null)
  const [formData, setFormData] = useState<Record<string, string>>({})

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const payload = fields.reduce<Record<string, unknown>>((acc, field) => {
      const value = formData[String(field.key)] ?? ''
      acc[String(field.key)] = field.type === 'number' ? Number(value) : value
      return acc
    }, {})

    if (editId) {
      onUpdate(editId, payload as Partial<Omit<T, 'id' | 'createdAt' | 'updatedAt'>>)
    } else {
      onCreate(payload as Omit<T, 'id' | 'createdAt' | 'updatedAt'>)
    }
    setEditId(null)
    setFormData({})
  }

  const startEdit = (record: T) => {
    const nextData = fields.reduce<Record<string, string>>((acc, field) => {
      const value = record[field.key]
      acc[String(field.key)] = String(value ?? '')
      return acc
    }, {})
    setFormData(nextData)
    setEditId(record.id)
  }

  return (
    <section className="rounded-2xl border border-cyan-500/20 bg-slate-950/55 p-4 shadow-[0_0_40px_-12px_rgba(34,211,238,0.25)] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-cyan-100">{title}</h2>
        <p className="text-sm text-slate-400">Total: {records.length}</p>
      </div>

      <form className="mb-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" onSubmit={handleSubmit}>
        {fields.map((field) => (
          <input
            key={String(field.key)}
            required
            type={field.type ?? 'text'}
            placeholder={field.label}
            className={inputClass}
            value={formData[String(field.key)] ?? ''}
            onChange={(event) =>
              setFormData((prev) => ({
                ...prev,
                [String(field.key)]: event.target.value,
              }))
            }
          />
        ))}
        <button
          type="submit"
          className="min-h-11 w-full touch-manipulation rounded-lg bg-gradient-to-r from-cyan-600 to-violet-600 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_0_24px_-4px_rgba(34,211,238,0.45)] transition hover:brightness-110 sm:col-span-2 sm:min-h-0 sm:w-auto sm:py-2 lg:col-span-1"
        >
          {editId ? 'Update' : 'Create'}
        </button>
      </form>

      <div className="-mx-1 overflow-x-auto rounded-xl border border-cyan-500/10 bg-slate-950/40 sm:mx-0">
        <table className="w-full min-w-[600px] border-collapse text-left text-xs md:min-w-0 md:text-sm">
          <thead>
            <tr className="border-b border-cyan-500/20 bg-slate-900/50">
              {fields.map((field) => (
                <th
                  key={String(field.key)}
                  className="whitespace-nowrap px-2 py-2.5 font-semibold text-cyan-200/90 sm:px-3"
                >
                  {field.label}
                </th>
              ))}
              <th className="whitespace-nowrap px-2 py-2.5 font-semibold text-cyan-200/90 sm:px-3">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-cyan-500/10 transition hover:bg-cyan-500/5"
              >
                {fields.map((field) => (
                  <td
                    key={String(field.key)}
                    className="max-w-[12rem] break-words px-2 py-2 align-top text-slate-200 sm:max-w-none sm:px-3 sm:break-normal"
                  >
                    {String(record[field.key] ?? '')}
                  </td>
                ))}
                <td className="whitespace-nowrap px-2 py-2 align-top sm:px-3">
                  <div className="flex flex-wrap gap-2">
                    <button
                      type="button"
                      onClick={() => startEdit(record)}
                      className="touch-manipulation rounded-lg border border-amber-500/40 bg-amber-600/80 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-amber-500"
                    >
                      Edit
                    </button>
                    <button
                      type="button"
                      onClick={() => onDelete(record.id)}
                      className="touch-manipulation rounded-lg border border-rose-500/40 bg-rose-600/80 px-2.5 py-1.5 text-xs font-semibold text-white hover:bg-rose-500"
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
