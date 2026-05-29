import type { OrderInPack } from './types'

/** Демо: сколько ордеров в пачке (в проде придёт с API). */
export const ORDERS_DEMO_TOTAL = 200

/** Сколько последних ордеров показывать на главном экране пачки. */
export const ORDERS_PREVIEW_COUNT = 3

function cloneOrderWithOrderNumber(src: OrderInPack, id: string, orderNum: string): OrderInPack {
  const next = structuredClone(src) as OrderInPack
  next.id = id
  next.meta = [src.meta[0] ?? 'Account: #12345678', `Order: ${orderNum}`]
  next.detail = {
    ...next.detail,
    details: next.detail.details.map((row) => {
      if (row.label === 'Order') return { ...row, value: orderNum }
      if (row.label === 'Line ref.') return { ...row, value: `LY-ORD-${orderNum}` }
      if (row.label === 'Conversion ref.') return { ...row, value: `CB-CONV-${orderNum}` }
      return row
    }),
  }
  return next
}

export function expandOrdersForDemo(
  orders: OrderInPack[],
  idPrefix: string,
  targetTotal: number = ORDERS_DEMO_TOTAL,
): OrderInPack[] {
  if (orders.length >= targetTotal) return orders
  const out = [...orders]
  let i = 0
  while (out.length < targetTotal) {
    const src = orders[i % orders.length]
    const orderNum = String(9100820 + out.length)
    out.push(cloneOrderWithOrderNumber(src, `${idPrefix}-more-${out.length}`, orderNum))
    i++
  }
  return out
}
