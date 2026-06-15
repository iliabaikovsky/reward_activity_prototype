export type DateRangeFilter =
  | { mode: 'all' }
  | { mode: 'range'; startIso: string; endIso: string }

export const ALL_TIME_DATE_RANGE: DateRangeFilter = { mode: 'all' }

export const DATE_RANGE_ALL_TIME_LABEL = 'All time'

function parseIsoDay(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
}

function formatChipDate(iso: string): string {
  const [y, m, d] = iso.split('-').map(Number)
  const dd = String(d).padStart(2, '0')
  const mm = String(m).padStart(2, '0')
  return `${dd}/${mm}/${y}`
}

/** Chip label: «All time» or «01/01/2026 - 12/01/2026». */
export function formatDateRangeChipLabel(filter: DateRangeFilter): string {
  if (filter.mode === 'all') return DATE_RANGE_ALL_TIME_LABEL
  return `${formatChipDate(filter.startIso)} - ${formatChipDate(filter.endIso)}`
}

/** Hero scope phrase: «all time» or «Mar 1–Mar 31, 2026». */
export function formatDateRangeForSummary(filter: DateRangeFilter): string {
  if (filter.mode === 'all') return 'all time'

  const start = parseIsoDay(filter.startIso)
  const end = parseIsoDay(filter.endIso)
  const fmt = (d: Date) =>
    d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  const year = end.getUTCFullYear()
  const startStr = fmt(start)
  const endStr = fmt(end)

  if (filter.startIso === filter.endIso) return `${startStr}, ${year}`
  return `${startStr}–${endStr}, ${year}`
}

export function normalizeDateRange(
  startIso: string,
  endIso: string,
): DateRangeFilter {
  if (!startIso || !endIso) return ALL_TIME_DATE_RANGE
  if (startIso <= endIso) {
    return { mode: 'range', startIso, endIso }
  }
  return { mode: 'range', startIso: endIso, endIso: startIso }
}

export function isDateIsoInRange(dateIso: string, filter: DateRangeFilter): boolean {
  if (filter.mode === 'all') return true
  const d = parseIsoDay(dateIso)
  const start = parseIsoDay(filter.startIso)
  const end = parseIsoDay(filter.endIso)
  end.setUTCHours(23, 59, 59, 999)
  return d >= start && d <= end
}

/** Inclusive day match for order list dates parsed to local Date. */
export function isOrderDateInRange(orderDate: Date | null, filter: DateRangeFilter): boolean {
  if (filter.mode === 'all') return true
  if (!orderDate) return false

  const start = parseIsoDay(filter.startIso)
  const end = parseIsoDay(filter.endIso)
  end.setUTCHours(23, 59, 59, 999)

  const local = new Date(orderDate.getFullYear(), orderDate.getMonth(), orderDate.getDate(), 12, 0, 0)
  const startLocal = new Date(start.getUTCFullYear(), start.getUTCMonth(), start.getUTCDate(), 0, 0, 0)
  const endLocal = new Date(end.getUTCFullYear(), end.getUTCMonth(), end.getUTCDate(), 23, 59, 59)

  return local >= startLocal && local <= endLocal
}

export function isDateRangeActive(filter: DateRangeFilter): boolean {
  return filter.mode === 'range'
}
