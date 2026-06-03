import type { OrderInPack, PackConfig } from '../components/reward/RewardDetailModal/configs'
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

  if (order.title === 'EXD → Cashback') {
    const exdDebited = parseExdAbsolute(order.amount)
    const amountUsd =
      order.cashbackUsdLeg != null
        ? order.cashbackUsdLeg
        : Math.round(exdDebited * EXD_TO_USD_CASHBACK_RATE * 100) / 100
    const pending = packChipText !== 'Credited'
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
