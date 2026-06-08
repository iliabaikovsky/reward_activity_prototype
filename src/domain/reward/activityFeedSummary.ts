import { parseExdAmount } from './parseExd'
import type { ActivityFeedItem } from '../../rewardLifecycle/activityFeedModel'
import {
  DATE_RANGE_FOR_SUMMARY,
  TYPE_FILTER_LABELS,
  type ActivityDatePreset,
  type ActivityTypeFilter,
} from '../../screens/activityFeedTypes'
import { parseSignedAmount } from '../../rewardLifecycle/rebateSimulatorSteps'

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

function sumUsd(items: ActivityFeedItem[]): number {
  return items.reduce((acc, item) => acc + Math.max(0, parseSignedAmount(item.amount)), 0)
}

function formatUsdTotal(n: number): string {
  return `${n.toFixed(2)} USD`
}

function formatExdTotal(n: number): string {
  return `${n.toFixed(2)} EXD`
}

function buildScopeLabel(
  typeFilter: Exclude<ActivityTypeFilter, 'all'>,
  datePreset: ActivityDatePreset,
): string {
  const typeName = TYPE_FILTER_LABELS[typeFilter]
  const range = DATE_RANGE_FOR_SUMMARY[datePreset]
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
  datePreset: ActivityDatePreset = 'all',
): ActivityFeedFilterSummary | null {
  if (typeFilter === 'all' || items.length === 0) return null

  const scopeLabel = buildScopeLabel(typeFilter, datePreset)

  if (typeFilter === 'rewards') {
    const amountPrimary = formatExdTotal(sumExd(items))
    return {
      scopeLabel,
      amountPrimary,
      ariaLabel: buildAriaLabel(scopeLabel, amountPrimary),
    }
  }

  if (typeFilter === 'cashback') {
    const amountPrimary = formatUsdTotal(sumUsd(items))
    return {
      scopeLabel,
      amountPrimary,
      ariaLabel: buildAriaLabel(scopeLabel, amountPrimary),
    }
  }

  if (typeFilter === 'transfers') {
    const amountPrimary = formatExdTotal(sumExd(items))
    return {
      scopeLabel,
      amountPrimary,
      ariaLabel: buildAriaLabel(scopeLabel, amountPrimary),
    }
  }

  const exd = sumExd(items)
  const usd = sumUsd(items)
  const amountPrimary = exd > 0 ? formatExdTotal(exd) : formatUsdTotal(usd)
  const amountSecondary =
    exd > 0 && usd > 0 ? formatUsdTotal(usd) : exd === 0 && usd === 0 ? formatExdTotal(0) : undefined

  return {
    scopeLabel,
    amountPrimary,
    amountSecondary,
    ariaLabel: buildAriaLabel(scopeLabel, amountPrimary, amountSecondary),
  }
}
