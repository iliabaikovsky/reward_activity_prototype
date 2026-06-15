import { parseExdAmount } from './parseExd'
import { sumCashbackAmountsAsUsd } from './parseSignedMoney'
import type { ActivityFeedItem } from '../../rewardLifecycle/activityFeedModel'
import { formatDateRangeForSummary, type DateRangeFilter } from './dateRangeFilter'
import { TYPE_FILTER_LABELS, type ActivityTypeFilter } from '../../screens/activityFeedTypes'

export type ActivityFeedFilterSummary = {
  /** «Rewards for all time», «Cashback for 7 days» */
  scopeLabel: string
  amountPrimary: string
  amountSecondary?: string
  ariaLabel: string
}

function sumExd(items: ActivityFeedItem[]): number {
  return items.reduce((acc, item) => acc + Math.max(0, parseExdAmount(item.amount)), 0)
}

function sumCashbackUsd(items: ActivityFeedItem[]): number {
  return sumCashbackAmountsAsUsd(items.map((item) => item.amount))
}

function formatUsdTotal(n: number): string {
  return `${n.toFixed(2)} USD`
}

function formatExdTotal(n: number): string {
  return `${n.toFixed(2)} EXD`
}

function buildScopeLabel(
  typeFilter: Exclude<ActivityTypeFilter, 'all'>,
  dateRange: DateRangeFilter,
): string {
  const typeName = TYPE_FILTER_LABELS[typeFilter]
  const range = formatDateRangeForSummary(dateRange)
  return `${typeName} for ${range}`
}

function buildAriaLabel(scopeLabel: string, amountPrimary: string, amountSecondary?: string): string {
  const amounts = [amountPrimary, amountSecondary].filter(Boolean).join(', ')
  return `${scopeLabel}, ${amounts}`
}

/** Totals for filtered feed items (type + date already applied). */
export function summarizeActivityFeedByType(
  items: ActivityFeedItem[],
  typeFilter: ActivityTypeFilter,
  dateRange: DateRangeFilter = { mode: 'all' },
): ActivityFeedFilterSummary | null {
  if (typeFilter === 'all' || items.length === 0) return null
  if (typeFilter !== 'rewards' && typeFilter !== 'cashback') return null

  const scopeLabel = buildScopeLabel(typeFilter, dateRange)

  if (typeFilter === 'rewards') {
    const amountPrimary = formatExdTotal(sumExd(items))
    return {
      scopeLabel,
      amountPrimary,
      ariaLabel: buildAriaLabel(scopeLabel, amountPrimary),
    }
  }

  const amountPrimary = formatUsdTotal(sumCashbackUsd(items))
  return {
    scopeLabel,
    amountPrimary,
    ariaLabel: buildAriaLabel(scopeLabel, amountPrimary),
  }
}
