import type { OrderInPack, PackConfig } from '../components/reward/RewardDetailModal/configs'
import { DEMO_CASHBACK_CALC_ORDER_ID } from '../domain/reward/cashbackRebateCalculation'
import type { TradingOrderRegistry } from '../domain/reward/tradingOrder'
import {
  buildCashbackPackFromActivityPreview,
  buildCashbackPackFromUpcomingRow,
  buildDemoLinkedCashbackPack,
  buildDemoLinkedLoyaltyOrder,
  buildDemoLinkedLoyaltyPack,
  buildLoyaltyPackFromUpcomingRow,
  isLinkedCashbackPreviewId,
  isLinkedCashbackUpcomingId,
} from './buildLoyaltyModalPack'
import type { LifecycleStep } from './lifecycleSteps'
import {
  ingestPackIntoRegistry,
  mergeOrderLegIntoRegistry,
  parseTradingOrderNum,
} from './tradingOrderRegistry'

const DEMO_LINKED_LOYALTY_EXD = 1

export type AggregateKind = 'loyalty' | 'cashback'

export type CompanionAggregates = Record<AggregateKind, PackConfig | null>

/**
 * When cashback leg exists but loyalty is missing (static pack / partial ingest),
 * pull loyalty from the step's upcoming row for the same order #.
 */
function ensureLinkedTradingOrderLegs(registry: TradingOrderRegistry, step: LifecycleStep): void {
  for (const row of step.upcoming) {
    if (row.rewardModal === 'loyalty-upcoming') {
      const pack = buildLoyaltyPackFromUpcomingRow(row)
      for (const order of pack.orders) {
        const orderNum = parseTradingOrderNum(order)
        if (!orderNum) continue
        const entry = registry[orderNum]
        if (entry?.cashbackFromExd && (entry.exdEarned?.amountExd ?? 0) <= 0) {
          mergeOrderLegIntoRegistry(registry, order, pack.chip.text)
        }
      }
    }
    if (row.rewardModal === 'cashback-upcoming' && isLinkedCashbackUpcomingId(row.id)) {
      const pack = buildCashbackPackFromUpcomingRow(row)
      for (const order of pack.orders) {
        const orderNum = parseTradingOrderNum(order)
        if (!orderNum) continue
        const entry = registry[orderNum]
        if (entry?.exdEarned && !entry.cashbackFromExd) {
          mergeOrderLegIntoRegistry(registry, order, pack.chip.text)
        }
      }
    }
  }

  for (const row of step.activityPreview) {
    if (row.rewardModal === 'cashback-activated' && isLinkedCashbackPreviewId(row.id)) {
      const pack = buildCashbackPackFromActivityPreview(row)
      for (const order of pack.orders) {
        const orderNum = parseTradingOrderNum(order)
        if (!orderNum) continue
        const entry = registry[orderNum]
        if (entry?.exdEarned && !entry.cashbackFromExd) {
          mergeOrderLegIntoRegistry(registry, order, pack.chip.text)
        }
      }
    }
  }
}

/** Static cashback pack on early steps: #9100821 still earns loyalty per REWARD_LIFECYCLE §7. */
export function applyLinkedTradeDemoFallback(registry: TradingOrderRegistry): void {
  const entry = registry[DEMO_CASHBACK_CALC_ORDER_ID]
  if (!entry?.cashbackFromExd) return
  if ((entry.exdEarned?.amountExd ?? 0) > 0) return

  registry[DEMO_CASHBACK_CALC_ORDER_ID] = {
    ...entry,
    exdEarned: {
      amountExd: DEMO_LINKED_LOYALTY_EXD,
      pending: entry.cashbackFromExd.pending,
    },
  }
}

/**
 * Registry из `step.upcoming` + linked credited cashback в preview (шаг 8: #9100821).
 * Остальной feed/preview не смешиваем — другие order ID.
 */
export function buildTradingOrderRegistryForStep(step: LifecycleStep): TradingOrderRegistry {
  const registry: TradingOrderRegistry = {}

  for (const row of step.upcoming) {
    if (row.rewardModal === 'loyalty-upcoming') {
      ingestPackIntoRegistry(registry, buildLoyaltyPackFromUpcomingRow(row))
    }
    if (row.rewardModal === 'cashback-upcoming') {
      ingestPackIntoRegistry(registry, buildCashbackPackFromUpcomingRow(row))
    }
  }

  for (const row of step.activityPreview) {
    if (row.rewardModal === 'cashback-activated' && isLinkedCashbackPreviewId(row.id)) {
      ingestPackIntoRegistry(registry, buildCashbackPackFromActivityPreview(row))
    }
  }

  ensureLinkedTradingOrderLegs(registry, step)
  applyLinkedTradeDemoFallback(registry)

  return registry
}

/** Loyalty + cashback pack configs for cross-type closed-order drill (same simulator step). */
export function buildCompanionAggregatesForStep(step: LifecycleStep): CompanionAggregates {
  let loyalty: PackConfig | null = null
  let cashback: PackConfig | null = null

  for (const row of step.upcoming) {
    if (row.rewardModal === 'loyalty-upcoming') {
      loyalty = buildLoyaltyPackFromUpcomingRow(row)
    }
    if (row.rewardModal === 'cashback-upcoming') {
      cashback = buildCashbackPackFromUpcomingRow(row)
    }
  }

  for (const row of step.activityPreview) {
    if (row.rewardModal === 'cashback-activated' && isLinkedCashbackPreviewId(row.id)) {
      cashback = buildCashbackPackFromActivityPreview(row)
    }
  }

  if (!loyalty) loyalty = buildDemoLinkedLoyaltyPack()
  if (!cashback) cashback = buildDemoLinkedCashbackPack()

  return { loyalty, cashback }
}

/** Order legs from companion aggregates for closed-order drill targets. */
export function buildCompanionOrderLegsForStep(step: LifecycleStep): OrderInPack[] {
  const { loyalty, cashback } = buildCompanionAggregatesForStep(step)
  const byId = new Map<string, OrderInPack>()
  for (const order of [...(loyalty?.orders ?? []), ...(cashback?.orders ?? [])]) {
    byId.set(order.id, order)
  }
  if (
    ![...byId.values()].some(
      (o) => parseTradingOrderNum(o) === DEMO_CASHBACK_CALC_ORDER_ID && o.title === 'Loyalty reward',
    )
  ) {
    byId.set(buildDemoLinkedLoyaltyOrder().id, buildDemoLinkedLoyaltyOrder())
  }
  return [...byId.values()]
}

export function packAggregateKind(pack: PackConfig): AggregateKind {
  return pack.heroIcon === 'crown' ? 'loyalty' : 'cashback'
}
