import { isOrderDateInRange, type DateRangeFilter } from '../../../domain/reward/dateRangeFilter'
import { parseModalDateTimeLoose } from '../../../domain/reward/formatModalDateTimeUtc'
import type { OrderInPack } from './configs/types'

const DEMO_YEAR = 2026

const MONTH_INDEX: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

const MONTH_LABELS = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
] as const

export type OrderMonthGroup = {
  monthId: string
  monthLabel: string
  orders: OrderInPack[]
}

/** Parse demo order date strings ("Mar 22, 16:06", "10 Jan 2026", modal UTC, …). */
export function parseOrderListDate(date: string): Date | null {
  const fromModal = parseModalDateTimeLoose(date)
  if (fromModal) return fromModal

  const dmy = date.match(/^(\d{1,2})\s+(\w{3})(?:\s+(\d{4}))?$/)
  if (dmy) {
    const month = MONTH_INDEX[dmy[2]]
    if (month === undefined) return null
    const year = dmy[3] ? Number(dmy[3]) : DEMO_YEAR
    return new Date(year, month, Number(dmy[1]))
  }

  const mdt = date.match(/^(\w{3})\s+(\d{1,2})/)
  if (mdt) {
    const month = MONTH_INDEX[mdt[1]]
    if (month === undefined) return null
    return new Date(DEMO_YEAR, month, Number(mdt[2]))
  }

  return null
}

export function monthIdFromDate(d: Date): string {
  return `${d.getFullYear()}-${d.getMonth() + 1}`
}

export function monthLabelFromDate(d: Date): string {
  return `${MONTH_LABELS[d.getMonth()]} ${d.getFullYear()}`
}

export function filterOrders(
  orders: OrderInPack[],
  opts: { query: string; dateRange: DateRangeFilter },
): OrderInPack[] {
  const q = opts.query.trim().toLowerCase()

  return orders.filter((order) => {
    if (!isOrderDateInRange(parseOrderListDate(order.date), opts.dateRange)) {
      return false
    }

    if (!q) return true

    const haystack = [order.title, order.amount, order.date, ...order.meta].join(' ').toLowerCase()
    return haystack.includes(q)
  })
}

export function groupOrdersByMonth(orders: OrderInPack[]): OrderMonthGroup[] {
  const groups = new Map<string, OrderMonthGroup>()

  for (const order of orders) {
    const parsed = parseOrderListDate(order.date)
    const monthId = parsed ? monthIdFromDate(parsed) : 'unknown'
    const monthLabel = parsed ? monthLabelFromDate(parsed) : 'Unknown date'

    const existing = groups.get(monthId)
    if (existing) {
      existing.orders.push(order)
    } else {
      groups.set(monthId, { monthId, monthLabel, orders: [order] })
    }
  }

  return [...groups.values()]
    .sort((a, b) => b.monthId.localeCompare(a.monthId))
    .map((group) => ({
      ...group,
      orders: [...group.orders].sort((a, b) => {
        const da = parseOrderListDate(a.date)?.getTime() ?? 0
        const db = parseOrderListDate(b.date)?.getTime() ?? 0
        return db - da
      }),
    }))
}
