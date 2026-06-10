import type { OrderInPack, PackConfig } from '../components/reward/RewardDetailModal/configs'
import { EXD_DEDUCTED_LABEL } from '../components/reward/RewardDetailModal/configs/cashbackExdDebitExplainer'
import { parseExdAbsolute } from '../domain/reward/parseExd'
import {
  EXD_TO_USD_CASHBACK_RATE,
  type TradingOrderRegistry,
  type TradingOrderRewardsEntry,
} from '../domain/reward/tradingOrder'

export function parseTradingOrderNum(order: OrderInPack): string | null {
  const meta = order.meta.find((m) => /^Order:\s*/i.test(m))
  if (meta) return meta.replace(/^Order:\s*/i, '').trim()
  const row = order.detail.details.find((r) => r.label === 'Order')
  return row?.value?.trim() ?? null
}

export type RewardOrderLeg = 'exdEarned' | 'cashbackFromExd'

/** Order leg in pack modal for a trading order # (closed-order drill). */
export function findPackOrderByTradingNum(
  orders: OrderInPack[],
  orderNum: string,
  leg: RewardOrderLeg,
): OrderInPack | undefined {
  const matching = orders.filter((o) => parseTradingOrderNum(o) === orderNum)
  if (leg === 'exdEarned') {
    return matching.find((o) => o.title === 'Loyalty reward')
  }
  return matching.find((o) => isCashbackPackOrder(o))
}

function isCashbackPackOrder(order: OrderInPack): boolean {
  return (
    order.title === 'EXD → Cashback' ||
    order.title === 'EXD cashback' ||
    order.legMode === 'upcoming' ||
    order.legMode === 'credited' ||
    order.cashbackUsdLeg != null
  )
}

function exdDebitedFromCashbackOrder(order: OrderInPack): number {
  const debitedRow = order.detail.details.find((r) => r.label === EXD_DEDUCTED_LABEL)
  if (debitedRow) return parseExdAbsolute(debitedRow.value)
  return parseExdAbsolute(order.amount)
}

export function mergeOrderLegIntoRegistry(
  registry: TradingOrderRegistry,
  order: OrderInPack,
  packChipText: string,
): void {
  const orderNum = parseTradingOrderNum(order)
  if (!orderNum) return

  const prev = registry[orderNum] ?? {}
  const next: TradingOrderRewardsEntry = { ...prev }

  if (order.title === 'Loyalty reward') {
    const amountExd = parseExdAbsolute(order.amount)
    const pending = order.detail.chip.text === 'Upcoming'
    next.exdEarned = {
      amountExd: (prev.exdEarned?.amountExd ?? 0) + amountExd,
      pending: prev.exdEarned?.pending === false ? false : pending,
    }
  }

  if (isCashbackPackOrder(order)) {
    const exdDebited = exdDebitedFromCashbackOrder(order)
    const amountUsd =
      order.cashbackUsdLeg != null
        ? order.cashbackUsdLeg
        : Math.round(exdDebited * EXD_TO_USD_CASHBACK_RATE * 100) / 100
    const pending =
      order.legMode != null
        ? order.detail.chip.text !== 'Credited'
        : packChipText !== 'Credited'
    next.cashbackFromExd = {
      exdDebited: (prev.cashbackFromExd?.exdDebited ?? 0) + exdDebited,
      amountUsd: (prev.cashbackFromExd?.amountUsd ?? 0) + amountUsd,
      pending: prev.cashbackFromExd?.pending === false ? false : pending,
    }
  }

  registry[orderNum] = next
}

export function ingestPackIntoRegistry(
  registry: TradingOrderRegistry,
  pack: PackConfig | null,
): void {
  if (!pack) return
  for (const order of pack.orders) {
    mergeOrderLegIntoRegistry(registry, order, pack.chip.text)
  }
}

/** Merge pack legs only when that leg is missing on the order (avoids double cashback on simulator). */
export function ingestPackLegsIfMissing(
  registry: TradingOrderRegistry,
  pack: PackConfig | null,
): void {
  if (!pack) return
  for (const order of pack.orders) {
    const orderNum = parseTradingOrderNum(order)
    if (!orderNum) {
      mergeOrderLegIntoRegistry(registry, order, pack.chip.text)
      continue
    }
    const entry = registry[orderNum]
    const needsLoyalty =
      order.title === 'Loyalty reward' && (entry?.exdEarned?.amountExd ?? 0) <= 0
    const needsCashback =
      isCashbackPackOrder(order) && (entry?.cashbackFromExd?.amountUsd ?? 0) <= 0
    if (!entry || needsLoyalty || needsCashback) {
      mergeOrderLegIntoRegistry(registry, order, pack.chip.text)
    }
  }
}
