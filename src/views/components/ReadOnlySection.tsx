import type { BaseEntity } from '../../types/erp'

interface FieldConfig<T> {
  key: keyof T
  label: string
}

interface ReadOnlySectionProps<T extends BaseEntity> {
  title: string
  fields: FieldConfig<T>[]
  records: T[]
}

export function ReadOnlySection<T extends BaseEntity>({
  title,
  fields,
  records,
}: ReadOnlySectionProps<T>) {
  return (
    <section className="rounded-2xl border border-violet-500/20 bg-slate-950/55 p-4 shadow-[0_0_40px_-12px_rgba(139,92,246,0.2)] backdrop-blur-xl sm:p-5">
      <div className="mb-4 flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold text-violet-100">{title}</h2>
        <p className="text-sm text-slate-400">Total: {records.length}</p>
      </div>

      <div className="-mx-1 overflow-x-auto rounded-xl border border-violet-500/10 bg-slate-950/40 sm:mx-0">
        <table className="w-full min-w-[600px] border-collapse text-left text-xs md:min-w-0 md:text-sm">
          <thead>
            <tr className="border-b border-violet-500/20 bg-slate-900/50">
              {fields.map((field) => (
                <th
                  key={String(field.key)}
                  className="whitespace-nowrap px-2 py-2.5 font-semibold text-violet-200/90 sm:px-3"
                >
                  {field.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {records.map((record) => (
              <tr
                key={record.id}
                className="border-b border-violet-500/10 transition hover:bg-violet-500/5"
              >
                {fields.map((field) => (
                  <td
                    key={String(field.key)}
                    className="max-w-[12rem] break-words px-2 py-2 align-top text-slate-200 sm:max-w-none sm:px-3 sm:break-normal"
                  >
                    {String(record[field.key] ?? '')}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
