import type { TradingOrderRegistry } from '../domain/reward/tradingOrder'
import {
  buildCashbackPackFromActivityPreview,
  buildCashbackPackFromUpcomingRow,
  buildLoyaltyPackFromUpcomingRow,
} from './buildLoyaltyModalPack'
import type { LifecycleStep } from './lifecycleSteps'
import { ingestPackIntoRegistry } from './tradingOrderRegistry'

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
    if (row.rewardModal === 'cashback-activated' && row.id === 'prev-cb') {
      ingestPackIntoRegistry(registry, buildCashbackPackFromActivityPreview(row))
    }
  }

  return registry
}
