import type { PackConfig, OrderInPack } from '../components/reward/RewardDetailModal'
import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import type { ActivityFeedItem } from './activityFeedModel'
import { UPCOMING_ACTIVATION_DATETIME } from './demoTimeline'
import type { LifecycleActivityPreviewItem, LifecycleStep, LifecycleUpcomingItem } from './lifecycleSteps'

function parseExdTotal(amount: string): number {
  const m = amount.replace(/,/g, '').match(/([+-]?\d+(?:\.\d+)?)\s*EXD/i)
  if (!m) return 0
  const n = parseFloat(m[1])
  return Number.isFinite(n) ? Math.abs(n) : 0
}

function formatExd(n: number): string {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)} EXD`
}

/** Разбить сумму на `parts` частей с точной суммой в центах */
function splitExdTotal(total: number, parts: number): number[] {
  if (parts <= 0) return []
  const cents = Math.round(total * 100)
  const base = Math.floor(cents / parts)
  const rem = cents % parts
  return Array.from({ length: parts }, (_, i) => (base + (i < rem ? 1 : 0)) / 100)
}

function inferOrderCount(total: number, badge?: string): number {
  if (badge) {
    const n = parseInt(badge, 10)
    if (n >= 1 && n <= 20) return n
  }
  if (total >= 3.15 && total <= 3.25) return 3
  if (total >= 1.99 && total <= 2.01) return 2
  if (total >= 0.99 && total <= 1.01) return 1
  return Math.max(1, Math.min(5, Math.round(total)))
}

function extractPeriodLabel(lines: string[]): string {
  for (const l of lines) {
    if (l.startsWith('For trading on ')) return l.slice('For trading on '.length).trim()
    if (l.startsWith('For period ')) return l.slice('For period '.length).trim()
  }
  return lines[0] ?? '—'
}

function extractActivatedPeriodFromLines(lines: string[]): string {
  for (const l of lines) {
    if (l.startsWith('For trading on ')) return l.slice('For trading on '.length).trim()
  }
  return lines[lines.length - 1] ?? '—'
}

function periodEndListDate(periodLabel: string): string {
  if (periodLabel.includes('Mar 18') && periodLabel.includes('22')) return 'Mar 22, 16:06'
  if (periodLabel.includes('Mar 11') && periodLabel.includes('15')) return 'Mar 15, 16:06'
  if (periodLabel.includes('Mar 25') && periodLabel.includes('29')) return 'Mar 29, 16:06'
  return 'Mar 22, 16:06'
}

function becomeAvailableOn(upcomingDateCol: string): string {
  return UPCOMING_ACTIVATION_DATETIME[upcomingDateCol] ?? `${upcomingDateCol.replace(/^on\s+/i, '').trim()} 2026, 18:43`
}

function buildOrders(
  parts: number[],
  periodLabel: string,
  mode: 'upcoming' | 'activated',
  idPrefix: string,
): OrderInPack[] {
  const packLine = `Loyalty rewards · ${periodLabel}`
  const listDate = periodEndListDate(periodLabel)
  const baseOrder = 9100820

  return parts.map((amt, i) => {
    const orderNum = String(baseOrder + i + 1)
    const chipText = mode === 'upcoming' ? 'Upcoming' : 'Activated'
    const chipTone = mode === 'upcoming' ? ('warning' as const) : ('success' as const)
    const detailRows =
      mode === 'upcoming'
        ? [
            { label: 'Pack', value: packLine },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: orderNum },
            { label: 'Trading volume', value: `${(8 + i * 0.3).toFixed(1)} lots (period)` },
            { label: 'Tier applied', value: 'Ultimate · x2' },
            { label: 'Accrued on', value: listDate },
            { label: 'Line ref.', value: `LY-ORD-${orderNum}` },
          ]
        : [
            { label: 'Pack', value: packLine },
            { label: 'Credited to', value: 'Available rewards' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: orderNum },
            { label: 'Trading volume', value: `${(18 + i * 0.5).toFixed(1)} lots (period)` },
            { label: 'Posted on', value: listDate },
            { label: 'Line ref.', value: `LY-ORD-${orderNum}` },
          ]

    return {
      id: `${idPrefix}-${i + 1}`,
      listIcon: 'crown' as const,
      title: 'Loyalty reward',
      amount: formatExd(amt),
      meta: ['Account: #12345678', `Order: ${orderNum}`],
      date: listDate,
      detail: {
        navTitle: 'Loyalty reward',
        chip: { text: chipText, tone: chipTone },
        heroIcon: 'crown',
        amount: formatExd(amt),
        details: detailRows,
      },
    }
  })
}

function packFromUpcomingLike(
  total: number,
  badge: string | undefined,
  lines: string[],
  upcomingDateCol: string,
  mode: 'upcoming' | 'activated',
  movedOrAvailableLine: { label: string; value: string },
  idPrefix: string,
): PackConfig {
  const periodLabel = extractPeriodLabel(lines)
  const count = inferOrderCount(total, badge)
  const parts = splitExdTotal(total, count)
  const orders = buildOrders(parts, periodLabel, mode, idPrefix)

  const detailRows =
    mode === 'upcoming'
      ? [
          { label: 'Become available on', value: becomeAvailableOn(upcomingDateCol) },
          { label: 'For period', value: periodLabel },
        ]
      : [movedOrAvailableLine, { label: 'For trading period', value: periodLabel }]

  return {
    navTitle: 'Loyalty rewards',
    chip: mode === 'upcoming' ? { text: 'Upcoming', tone: 'warning' } : { text: 'Activated', tone: 'success' },
    heroIcon: 'crown',
    amount: formatExd(total),
    details: detailRows,
    orders,
  }
}

export function buildLoyaltyPackFromUpcomingRow(row: LifecycleUpcomingItem): PackConfig {
  const total = parseExdTotal(row.amount)
  return packFromUpcomingLike(
    total,
    row.badge,
    row.lines,
    row.date,
    'upcoming',
    { label: '', value: '' },
    'sim-loy-u',
  )
}

export function buildLoyaltyPackFromActivityPreview(row: LifecycleActivityPreviewItem): PackConfig {
  const total = parseExdTotal(row.amount)
  const periodLabel = extractActivatedPeriodFromLines(row.lines)
  const count = inferOrderCount(total, undefined)
  const parts = splitExdTotal(total, count)
  const orders = buildOrders(parts, periodLabel, 'activated', 'sim-loy-a')

  return {
    navTitle: 'Loyalty rewards',
    chip: { text: 'Activated', tone: 'success' },
    heroIcon: 'crown',
    amount: formatExd(total),
    details: [
      { label: 'Moved to available on', value: row.date },
      { label: 'For trading period', value: periodLabel },
    ],
    orders,
  }
}

export function buildLoyaltyPackFromFeedItem(
  item: ActivityFeedItem,
  groupDateLabel: string,
  time: string,
): PackConfig {
  const total = parseExdTotal(item.amount)
  const periodLabel = extractActivatedPeriodFromLines(item.lines)
  const count = inferOrderCount(total, undefined)
  const parts = splitExdTotal(total, count)
  const orders = buildOrders(parts, periodLabel, 'activated', `sim-feed-${item.id}`)

  const movedValue = `${groupDateLabel}, ${time}`

  return {
    navTitle: 'Loyalty rewards',
    chip: { text: 'Activated', tone: 'success' },
    heroIcon: 'crown',
    amount: formatExd(total),
    details: [
      { label: 'Moved to available on', value: movedValue },
      { label: 'For trading period', value: periodLabel },
    ],
    orders,
  }
}

export function buildLoyaltyModalPackOverride(
  step: LifecycleStep,
  variant: RewardModalVariant,
  feedItemId?: string,
): PackConfig | null {
  if (variant === 'loyalty-upcoming') {
    const row = step.upcoming.find((u) => u.icon === 'crown' && u.rewardModal === 'loyalty-upcoming')
    if (!row) return null
    return buildLoyaltyPackFromUpcomingRow(row)
  }
  if (variant === 'loyalty-activated') {
    if (feedItemId) {
      for (const g of step.feedGroups) {
        const it = g.items.find((i) => i.id === feedItemId)
        if (it && it.title === 'Loyalty rewards') {
          return buildLoyaltyPackFromFeedItem(it, g.dateLabel, it.time)
        }
      }
    }
    const preview = step.activityPreview.find((p) => p.rewardModal === 'loyalty-activated')
    if (preview) return buildLoyaltyPackFromActivityPreview(preview)
    return null
  }
  return null
}
