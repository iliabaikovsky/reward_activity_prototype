import type { PackConfig, OrderInPack } from '../components/reward/RewardDetailModal/configs'
import { cashbackOrderDetailRows } from '../components/reward/RewardDetailModal/configs/cashbackOrderDetailRows'
import {
  LOYALTY_LIST_BOOSTER_BADGE,
  loyaltyOrderDetailRows,
} from '../components/reward/RewardDetailModal/configs/loyaltyOrderDetailRows'
import {
  cashbackPackDetailRows,
  loyaltyPackDetailRows,
  PACK_DEFAULT_ACCOUNT,
} from '../components/reward/RewardDetailModal/configs/packDetailRows'
import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import { formatExd, parseExdAbsolute } from '../domain/reward/parseExd'
import { formatListDateTimeLoose } from '../domain/reward/formatListDateTime'
import {
  MONTH_SHORT,
  formatModalDateTimeUtc,
  formatModalDateTimeUtcFromDateAndTime,
  formatModalDateTimeUtcLoose,
  parseModalDateTimeLoose,
} from '../domain/reward/formatModalDateTimeUtc'
import type { ActivityFeedItem } from './activityFeedModel'
import { CB_PENDING_TRADE_DAY_SHORT, UPCOMING_ACTIVATION_DATETIME } from './demoTimeline'
import type { LifecycleActivityPreviewItem, LifecycleStep, LifecycleUpcomingItem } from './lifecycleSteps'
import { parseSignedAmount } from './rebateSimulatorSteps'

const EXD_TO_USD_RATE = 1.185

function extractAccountFromLines(lines: string[]): string {
  for (const l of lines) {
    const m = /^Account:\s*(.+)$/i.exec(l.trim())
    if (m) return m[1].trim()
  }
  return PACK_DEFAULT_ACCOUNT
}

/** День сделки: день до даты зачисления в ленте (T+1 credit). */
function tradeDayBeforeCreditIso(dateIso: string): string {
  const [y, m, d] = dateIso.split('-').map(Number)
  if (!y || !m || !d) return CB_PENDING_TRADE_DAY_SHORT
  const dt = new Date(Date.UTC(y, m - 1, d, 12, 0))
  dt.setUTCDate(dt.getUTCDate() - 1)
  return `${MONTH_SHORT[dt.getUTCMonth()]} ${dt.getUTCDate()}`
}

function resolveCashbackTradeDay(lines: string[], dateIso?: string, previewDate?: string): string {
  const fromLines = extractTradingDay(lines)
  if (fromLines !== CB_PENDING_TRADE_DAY_SHORT) return fromLines
  if (dateIso) return tradeDayBeforeCreditIso(dateIso)
  const m = previewDate?.trim().match(/^(\w{3})\s+(\d{1,2})/)
  if (m) {
    const day = Number(m[2])
    if (day > 1) return `${m[1]} ${day - 1}`
    return `${m[1]} ${day}`
  }
  return CB_PENDING_TRADE_DAY_SHORT
}

/** Разбить сумму на `parts` частей с точной суммой в центах */
function splitTotalCents(total: number, parts: number): number[] {
  if (parts <= 0) return []
  const cents = Math.round(total * 100)
  const base = Math.floor(cents / parts)
  const rem = cents % parts
  return Array.from({ length: parts }, (_, i) => (base + (i < rem ? 1 : 0)) / 100)
}

function splitExdTotal(total: number, parts: number): number[] {
  return splitTotalCents(total, parts)
}

function splitUsdTotal(total: number, parts: number): number[] {
  return splitTotalCents(total, parts)
}

function formatUsd(value: number): string {
  return `+${value.toFixed(2)} USD`
}

function formatExdDebit(value: number): string {
  return `-${value.toFixed(2)} EXD`
}

function inferCashbackOrderCount(totalUsd: number): number {
  if (totalUsd <= 1.5) return 1
  if (totalUsd <= 3.5) return 2
  return 3
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

/** Неделя пн–вс для loyalty (list: `For trading on Mar 16–22`). */
function extractPeriodLabel(lines: string[]): string {
  for (const l of lines) {
    if (l.startsWith('For trading on ')) return l.slice('For trading on '.length).trim()
    if (l.startsWith('For period ')) return l.slice('For period '.length).trim()
  }
  return lines[0] ?? '—'
}

/** День сделки для cashback (list: `For trading with EXD`; модалка: `For trading on`). */
function extractTradingDay(lines: string[]): string {
  for (const l of lines) {
    const withDay = /^For trading with EXD on (.+)$/i.exec(l.trim())
    if (withDay) return withDay[1].trim()
    if (l.trim() === 'For trading with EXD') return CB_PENDING_TRADE_DAY_SHORT
    if (l.startsWith('For trading on ')) return l.slice('For trading on '.length).trim()
  }
  return CB_PENDING_TRADE_DAY_SHORT
}

function extractActivatedPeriodFromLines(lines: string[]): string {
  for (const l of lines) {
    if (l.startsWith('For trading on ')) return l.slice('For trading on '.length).trim()
  }
  return lines[lines.length - 1] ?? '—'
}

function periodEndRaw(periodLabel: string): string {
  if (periodLabel.includes('Mar 16') && periodLabel.includes('22')) return 'Mar 22, 16:06'
  if (periodLabel.includes('Mar 9') && periodLabel.includes('15')) return 'Mar 15, 16:06'
  if (periodLabel.includes('Mar 24') && periodLabel.includes('29')) return 'Mar 29, 16:06'
  if (periodLabel.includes('Apr 13') && periodLabel.includes('19')) return 'Apr 19, 16:06'
  return 'Mar 22, 16:06'
}

function periodEndListDate(periodLabel: string): string {
  return formatListDateTimeLoose(periodEndRaw(periodLabel))
}

function periodEndModalDateTime(periodLabel: string): string {
  return formatModalDateTimeUtcLoose(periodEndRaw(periodLabel))
}

function tradeDayRaw(lines: string[]): string {
  const day = extractTradingDay(lines)
  return /^\w{3}\s+\d{1,2}$/.test(day) ? `${day}, 16:06` : 'Mar 22, 16:06'
}

function tradeDayListDate(lines: string[]): string {
  return formatListDateTimeLoose(tradeDayRaw(lines))
}

function tradeDayModalDateTime(tradeDay: string): string {
  const raw = /^\w{3}\s+\d{1,2}$/.test(tradeDay) ? `${tradeDay}, 16:06` : tradeDay
  return formatModalDateTimeUtcLoose(raw)
}

function creditsOn(upcomingDateCol: string): string {
  const mapped = UPCOMING_ACTIVATION_DATETIME[upcomingDateCol]
  if (mapped) {
    const parsed = parseModalDateTimeLoose(mapped)
    if (parsed) {
      return formatModalDateTimeUtc(
        new Date(
          Date.UTC(parsed.getUTCFullYear(), parsed.getUTCMonth(), parsed.getUTCDate(), 8, 0),
        ),
      )
    }
  }
  const trimmed = upcomingDateCol.replace(/^on\s+/i, '').trim()
  const fallback = parseModalDateTimeLoose(`${trimmed}, 2026, 08:00`)
  if (fallback) return formatModalDateTimeUtc(fallback)
  return formatModalDateTimeUtcLoose(`${trimmed}, 2026, 08:00`)
}

function becomeAvailableOn(upcomingDateCol: string): string {
  const mapped = UPCOMING_ACTIVATION_DATETIME[upcomingDateCol]
  if (mapped) return formatModalDateTimeUtcLoose(mapped)
  return formatModalDateTimeUtcLoose(
    `${upcomingDateCol.replace(/^on\s+/i, '').trim()}, 2026, 18:43`,
  )
}

function buildOrders(
  parts: number[],
  periodLabel: string,
  mode: 'upcoming' | 'activated',
  idPrefix: string,
): OrderInPack[] {
  const orderListDate = periodEndListDate(periodLabel)
  const orderModalDate = periodEndModalDateTime(periodLabel)
  const baseOrder = 9100820

  return parts.map((amt, i) => {
    const orderNum = String(baseOrder + i + 1)
    const chipText = mode === 'upcoming' ? 'Upcoming' : 'Activated'
    const chipTone = mode === 'upcoming' ? ('warning' as const) : ('success' as const)
    const detailRows = loyaltyOrderDetailRows(mode, orderModalDate, orderNum)

    return {
      id: `${idPrefix}-${i + 1}`,
      listIcon: 'crown' as const,
      title: 'Loyalty reward',
      listBoosterBadge: LOYALTY_LIST_BOOSTER_BADGE,
      amount: formatExd(amt),
      meta: ['Account: #12345678', `Order: ${orderNum}`],
      date: orderListDate,
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

  const whenValue =
    mode === 'upcoming' ? becomeAvailableOn(upcomingDateCol) : movedOrAvailableLine.value
  const whenLabel = mode === 'upcoming' ? 'Available on' : 'Activated on'
  const detailRows = loyaltyPackDetailRows(whenLabel, whenValue, periodLabel)

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
  const total = parseExdAbsolute(row.amount)
  return packFromUpcomingLike(
    total,
    row.badge,
    row.lines,
    row.date,
    'upcoming',
    { label: '', value: '' },
    row.id,
  )
}

function buildCashbackOrders(
  usdParts: number[],
  tradeDay: string,
  orderListDate: string,
  debitedOnModal: string,
  idPrefix: string,
): OrderInPack[] {
  const baseOrder = 12345680

  return usdParts.map((usdLeg, i) => {
    const orderNum = String(baseOrder + i + 1)
    const exdDebited = Math.round((usdLeg / EXD_TO_USD_RATE) * 100) / 100
    const detailRows = cashbackOrderDetailRows(tradeDay, orderNum, debitedOnModal)

    return {
      id: `${idPrefix}-cb-${i + 1}`,
      listIcon: 'exchange' as const,
      title: 'EXD → Cashback',
      amount: formatExdDebit(exdDebited),
      amountClass: 'negative' as const,
      meta: ['Account: #12345678', `Order: ${orderNum}`],
      date: orderListDate,
      detail: {
        navTitle: 'EXD → Cashback',
        chip: { text: 'Debited', tone: 'neutral' },
        heroIcon: 'dollar',
        amount: formatExdDebit(exdDebited),
        amountTone: 'negative' as const,
        details: detailRows,
      },
    }
  })
}

export function buildCashbackPackFromUpcomingRow(row: LifecycleUpcomingItem): PackConfig {
  const totalUsd = Math.max(0, parseSignedAmount(row.amount))
  const tradeDay = extractTradingDay(row.lines)
  const count = inferCashbackOrderCount(totalUsd)
  const usdParts = splitUsdTotal(totalUsd, count)
  const orderListDate = tradeDayListDate(row.lines)
  const debitedOn = tradeDayModalDateTime(tradeDay)
  const orders = buildCashbackOrders(usdParts, tradeDay, orderListDate, debitedOn, row.id)

  return {
    navTitle: 'EXD cashback',
    chip: { text: 'Upcoming', tone: 'warning' },
    heroIcon: 'dollar',
    amount: formatUsd(totalUsd),
    details: cashbackPackDetailRows('Credits on', creditsOn(row.date), tradeDay),
    orders,
  }
}

export function buildCashbackPackFromFeedItem(
  item: ActivityFeedItem,
  groupDateLabel: string,
  time: string,
  dateIso: string,
): PackConfig {
  const totalUsd = Math.max(0, parseSignedAmount(item.amount))
  const tradeDay = resolveCashbackTradeDay(item.lines, dateIso)
  const count = inferCashbackOrderCount(totalUsd)
  const usdParts = splitUsdTotal(totalUsd, count)
  const creditedOn = formatModalDateTimeUtcFromDateAndTime(groupDateLabel, time)
  const orderListDate = formatListDateTimeLoose(`${groupDateLabel.replace(/,\s*$/, '')}, ${time}`)
  const debitedOn = tradeDayModalDateTime(tradeDay)
  const orders = buildCashbackOrders(
    usdParts,
    tradeDay,
    orderListDate,
    debitedOn,
    `sim-feed-${item.id}`,
  )

  return {
    navTitle: 'EXD cashback',
    chip: { text: 'Credited', tone: 'success' },
    heroIcon: 'dollar',
    amount: formatUsd(totalUsd),
    details: cashbackPackDetailRows(
      'Credited on',
      creditedOn,
      tradeDay,
      extractAccountFromLines(item.lines),
    ),
    orders,
  }
}

export function buildCashbackPackFromActivityPreview(row: LifecycleActivityPreviewItem): PackConfig {
  const totalUsd = Math.max(0, parseSignedAmount(row.amount))
  const tradeDay = resolveCashbackTradeDay(row.lines, undefined, row.date)
  const count = inferCashbackOrderCount(totalUsd)
  const usdParts = splitUsdTotal(totalUsd, count)
  const creditedOn = formatModalDateTimeUtcLoose(row.date)
  const orderListDate = formatListDateTimeLoose(row.date)
  const debitedOn = tradeDayModalDateTime(tradeDay)
  const orders = buildCashbackOrders(usdParts, tradeDay, orderListDate, debitedOn, 'sim-cb-a')

  return {
    navTitle: 'EXD cashback',
    chip: { text: 'Credited', tone: 'success' },
    heroIcon: 'dollar',
    amount: formatUsd(totalUsd),
    details: cashbackPackDetailRows(
      'Credited on',
      creditedOn,
      tradeDay,
      extractAccountFromLines(row.lines),
    ),
    orders,
  }
}

function findUpcomingRow(
  step: LifecycleStep,
  itemId: string | undefined,
  icon: 'crown' | 'dollar',
  rewardModal: RewardModalVariant,
): LifecycleUpcomingItem | undefined {
  if (itemId) {
    const byId = step.upcoming.find((u) => u.id === itemId)
    if (byId) return byId
  }
  return step.upcoming.find((u) => u.icon === icon && u.rewardModal === rewardModal)
}

export function buildRewardModalPackOverride(
  step: LifecycleStep,
  variant: RewardModalVariant,
  itemId?: string,
): PackConfig | null {
  if (variant === 'loyalty-upcoming') {
    const row = findUpcomingRow(step, itemId, 'crown', 'loyalty-upcoming')
    if (!row) return null
    return buildLoyaltyPackFromUpcomingRow(row)
  }
  if (variant === 'cashback-upcoming') {
    const row = findUpcomingRow(step, itemId, 'dollar', 'cashback-upcoming')
    if (!row) return null
    return buildCashbackPackFromUpcomingRow(row)
  }
  if (variant === 'loyalty-activated') {
    if (itemId) {
      for (const g of step.feedGroups) {
        const it = g.items.find((i) => i.id === itemId)
        if (it && it.title === 'Loyalty rewards') {
          return buildLoyaltyPackFromFeedItem(it, g.dateLabel, it.time)
        }
      }
    }
    const preview = step.activityPreview.find((p) => p.rewardModal === 'loyalty-activated')
    if (preview) return buildLoyaltyPackFromActivityPreview(preview)
    return null
  }
  if (variant === 'cashback-activated') {
    if (itemId) {
      for (const g of step.feedGroups) {
        const it = g.items.find((i) => i.id === itemId)
        if (it && it.title === 'EXD cashback') {
          return buildCashbackPackFromFeedItem(it, g.dateLabel, it.time, g.dateIso)
        }
      }
    }
    const preview = step.activityPreview.find((p) => p.rewardModal === 'cashback-activated')
    if (preview) return buildCashbackPackFromActivityPreview(preview)
    return null
  }
  return null
}

/** @deprecated Use buildRewardModalPackOverride */
export function buildLoyaltyModalPackOverride(
  step: LifecycleStep,
  variant: RewardModalVariant,
  itemId?: string,
): PackConfig | null {
  return buildRewardModalPackOverride(step, variant, itemId)
}

export function buildLoyaltyPackFromActivityPreview(row: LifecycleActivityPreviewItem): PackConfig {
  const total = parseExdAbsolute(row.amount)
  const periodLabel = extractActivatedPeriodFromLines(row.lines)
  const count = inferOrderCount(total, undefined)
  const parts = splitExdTotal(total, count)
  const orders = buildOrders(parts, periodLabel, 'activated', 'sim-loy-a')

  return {
    navTitle: 'Loyalty rewards',
    chip: { text: 'Activated', tone: 'success' },
    heroIcon: 'crown',
    amount: formatExd(total),
    details: loyaltyPackDetailRows(
      'Activated on',
      formatModalDateTimeUtcLoose(row.date),
      periodLabel,
    ),
    orders,
  }
}

export function buildLoyaltyPackFromFeedItem(
  item: ActivityFeedItem,
  groupDateLabel: string,
  time: string,
): PackConfig {
  const total = parseExdAbsolute(item.amount)
  const periodLabel = extractActivatedPeriodFromLines(item.lines)
  const count = inferOrderCount(total, undefined)
  const parts = splitExdTotal(total, count)
  const orders = buildOrders(parts, periodLabel, 'activated', `sim-feed-${item.id}`)

  const movedValue = formatModalDateTimeUtcFromDateAndTime(groupDateLabel, time)

  return {
    navTitle: 'Loyalty rewards',
    chip: { text: 'Activated', tone: 'success' },
    heroIcon: 'crown',
    amount: formatExd(total),
    details: loyaltyPackDetailRows('Activated on', movedValue, periodLabel),
    orders,
  }
}
