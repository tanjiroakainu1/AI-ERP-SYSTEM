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
    <section className="min-w-0 max-w-full rounded-2xl border border-violet-500/20 bg-slate-950/55 p-3 shadow-[0_0_40px_-12px_rgba(139,92,246,0.2)] backdrop-blur-xl sm:p-5">
      <div className="mb-3 flex flex-col gap-1 sm:mb-4 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-base font-semibold leading-snug text-violet-100 sm:text-lg">{title}</h2>
        <p className="text-sm text-slate-400">Total: {records.length}</p>
      </div>
      <p className="mb-2 text-[11px] leading-snug text-slate-500 lg:hidden">
        Swipe sideways on the table to see all columns.
      </p>

      <div
        className="relative -mx-1 w-full min-w-0 max-w-full touch-scroll-x touch-scroll-x--violet overflow-x-auto overscroll-x-contain rounded-xl border border-violet-500/10 bg-slate-950/40 sm:mx-0"
        role="region"
        aria-label="Data table, scroll horizontally on small screens"
      >
        <table className="w-full min-w-[600px] border-collapse text-left text-[0.8125rem] leading-snug sm:text-sm lg:min-w-0 lg:text-[0.9375rem]">
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
