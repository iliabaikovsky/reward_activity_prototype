import type { OrderInPack, PackConfig } from '../components/reward/RewardDetailModal/configs'
import {
  cashbackCreditedOrderDetailRows,
  cashbackUpcomingOrderDetailRows,
} from '../components/reward/RewardDetailModal/configs/cashbackOrderDetailRows'
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
import {
  fiatToUsdEquivalent,
  formatSignedMoney,
  parseSignedMoney,
} from '../domain/reward/parseSignedMoney'
import { formatListDateTimeLoose } from '../domain/reward/formatListDateTime'
import {
  MONTH_SHORT,
  formatModalDateTimeUtcFromDateAndTime,
  formatModalDateTimeUtcLoose,
  formatUpcomingByNoonUtc,
  parseModalDateTimeLoose,
} from '../domain/reward/formatModalDateTimeUtc'
import type { ActivityFeedItem } from './activityFeedModel'
import { CB_LIST_SUBTITLE, CB_ACCOUNT_LIST_LINE, CB_PENDING_TRADE_DAY_SHORT } from './demoTimeline'
import type { LifecycleActivityPreviewItem, LifecycleStep, LifecycleUpcomingItem } from './lifecycleSteps'
import { EXD_TO_USD_CASHBACK_RATE } from '../domain/reward/tradingOrder'

/** Текущий открытый период (Mar 16–22) — связываем с cashback на шаге trade_exd_rebate. */
const TRADING_ORDER_BASE = 9100820
/** Предыдущий закрытый период (Mar 9–15) — активация на шаге 4. */
const TRADING_ORDER_BASE_PREV = 9088800
const LEGACY_CASHBACK_ORDER_BASE = 12345680

function resolveTradingOrderBase(periodLabel: string): number {
  if (periodLabel.includes('Mar 9') && periodLabel.includes('15')) {
    return TRADING_ORDER_BASE_PREV
  }
  return TRADING_ORDER_BASE
}

/** Upcoming cashback rows that share Order ID with loyalty legs on the same step. */
const CASHBACK_LINKED_UPCOMING_IDS = new Set(['up-cb-pend'])

/** Credited cashback preview tied to trade_exd_rebate order #9100821 (step 8 registry). */
const CASHBACK_LINKED_PREVIEW_IDS = new Set(['prev-cb'])

/** Feed row for Mar 24 credit of the same trade (step 8+). */
const CASHBACK_LINKED_FEED_IDS = new Set(['feed-cb-1'])

/** Step 9 — order # base per trading account (nested orders in pack). */
const CASHBACK_ORDER_BASE_BY_ACCOUNT: Record<string, number> = {
  '#88112233': 88112201,
  '#99223344': 99223301,
  '#77334455': 77334401,
}

function shouldLinkCashbackToTradingOrders(upcomingId: string): boolean {
  return CASHBACK_LINKED_UPCOMING_IDS.has(upcomingId)
}

export function isLinkedCashbackUpcomingId(upcomingId: string): boolean {
  return shouldLinkCashbackToTradingOrders(upcomingId)
}

function shouldLinkCashbackPreview(previewId: string): boolean {
  return CASHBACK_LINKED_PREVIEW_IDS.has(previewId)
}

export function isLinkedCashbackPreviewId(previewId: string): boolean {
  return shouldLinkCashbackPreview(previewId)
}

function shouldLinkCashbackFeed(feedItemId: string): boolean {
  return CASHBACK_LINKED_FEED_IDS.has(feedItemId)
}

function cashbackOrderBuildOptions(link: boolean): { orderBase?: number; exdDebitMatchesUsd?: boolean } {
  return link
    ? { orderBase: TRADING_ORDER_BASE, exdDebitMatchesUsd: true }
    : {}
}

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

function splitMoneyTotal(total: number, parts: number, currency: string): number[] {
  if (parts <= 0) return []
  if (currency === 'JPY') {
    const base = Math.floor(total / parts)
    const rem = Math.round(total) % parts
    return Array.from({ length: parts }, (_, i) => base + (i < rem ? 1 : 0))
  }
  return splitTotalCents(total, parts)
}

function formatExdDebit(value: number): string {
  return `-${value.toFixed(2)} EXD`
}

/** Order count from USD-scale thresholds (works for any fiat via equivalent). */
function inferCashbackOrderCount(usdEquivalent: number): number {
  if (usdEquivalent <= 1.5) return 1
  if (usdEquivalent <= 3.5) return 2
  return 3
}

function resolveCashbackOrderCount(
  total: number,
  currency: string,
  linkSingle: boolean,
): number {
  if (linkSingle) return 1
  const usdEq = currency === 'USD' ? total : fiatToUsdEquivalent(total, currency)
  return inferCashbackOrderCount(usdEq)
}

function cashbackOrderBaseForAccount(account: string, link: boolean): number | undefined {
  if (link) return undefined
  return CASHBACK_ORDER_BASE_BY_ACCOUNT[account]
}

function exdDebitedForCashbackLeg(
  leg: number,
  currency: string,
  options?: { exdDebitMatchesUsd?: boolean },
): number {
  if (options?.exdDebitMatchesUsd) return leg
  const usdEq = currency === 'USD' ? leg : fiatToUsdEquivalent(leg, currency)
  return Math.round((usdEq / EXD_TO_USD_CASHBACK_RATE) * 100) / 100
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

function creditsOn(upcomingDateCol: string): string {
  return formatUpcomingByNoonUtc(upcomingDateCol)
}

function becomeAvailableOn(upcomingDateCol: string): string {
  return formatUpcomingByNoonUtc(upcomingDateCol)
}

function buildOrders(
  parts: number[],
  periodLabel: string,
  mode: 'upcoming' | 'activated',
  idPrefix: string,
): OrderInPack[] {
  const orderListDate = periodEndListDate(periodLabel)
  const orderModalDate = periodEndModalDateTime(periodLabel)
  const baseOrder = resolveTradingOrderBase(periodLabel)

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

const DEMO_LINKED_LOYALTY_UPCOMING: LifecycleUpcomingItem = {
  id: 'demo-linked-loy',
  icon: 'crown',
  title: 'Loyalty rewards',
  amount: '+1.00 EXD',
  lines: ['For trading on Mar 16–22'],
  date: 'on Mar 25',
  rewardModal: 'loyalty-upcoming',
}

const DEMO_LINKED_CASHBACK_UPCOMING: LifecycleUpcomingItem = {
  id: 'up-cb-pend',
  icon: 'dollar',
  title: 'EXD cashback',
  amount: '+5.00 USD',
  lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_LIST_LINE],
  date: 'on Mar 23',
  rewardModal: 'cashback-upcoming',
}

/** Demo loyalty pack for linked trade #9100821 (REWARD_LIFECYCLE §7). */
export function buildDemoLinkedLoyaltyPack(): PackConfig {
  return buildLoyaltyPackFromUpcomingRow(DEMO_LINKED_LOYALTY_UPCOMING)
}

/** Demo cashback pack for linked trade #9100821 (REWARD_LIFECYCLE §7). */
export function buildDemoLinkedCashbackPack(): PackConfig {
  return buildCashbackPackFromUpcomingRow(DEMO_LINKED_CASHBACK_UPCOMING)
}

/** Demo loyalty leg for linked trade #9100821 (REWARD_LIFECYCLE §7). */
export function buildDemoLinkedLoyaltyOrder(): OrderInPack {
  return buildDemoLinkedLoyaltyPack().orders[0]!
}

type CashbackOrderMode = 'upcoming' | 'credited'

function buildCashbackOrders(
  legParts: number[],
  currency: string,
  tradeDay: string,
  orderListDate: string,
  idPrefix: string,
  mode: CashbackOrderMode,
  account: string,
  options?: { orderBase?: number; exdDebitMatchesUsd?: boolean },
): OrderInPack[] {
  const baseOrder = options?.orderBase ?? LEGACY_CASHBACK_ORDER_BASE

  return legParts.map((leg, i) => {
    const orderNum = String(baseOrder + i + 1)
    const exdDebited = exdDebitedForCashbackLeg(leg, currency, options)
    const exdFormatted = formatExdDebit(exdDebited)

    const isUpcoming = mode === 'upcoming'
    const meta = [CB_LIST_SUBTITLE, `Order: ${orderNum}`]

    return {
      id: `${idPrefix}-cb-${i + 1}`,
      listIcon: 'exchange' as const,
      title: 'EXD cashback',
      amount: formatSignedMoney(leg, currency),
      cashbackUsdLeg: leg,
      legMode: mode,
      meta,
      date: orderListDate,
      detail: {
        navTitle: isUpcoming ? 'Upcoming cashback' : 'EXD cashback',
        chip: isUpcoming
          ? { text: 'Upcoming', tone: 'warning' }
          : { text: 'Credited', tone: 'success' },
        heroIcon: 'dollar',
        amount: formatSignedMoney(leg, currency),
        details: isUpcoming
          ? cashbackUpcomingOrderDetailRows(tradeDay, orderNum, exdFormatted, account)
          : cashbackCreditedOrderDetailRows(tradeDay, orderNum, exdFormatted, account),
      },
    }
  })
}

function buildCashbackPackFromMoney(
  sourceId: string,
  orderIdPrefix: string,
  amountStr: string,
  lines: string[],
  mode: CashbackOrderMode,
  packMeta: {
    navTitle: string
    chip: PackConfig['chip']
    whenLabel: string
    whenValue: string
    dateCol?: string
    previewDate?: string
    groupDateLabel?: string
    time?: string
    dateIso?: string
  },
): PackConfig {
  const { value: total, currency } = parseSignedMoney(amountStr)
  const tradeDay = resolveCashbackTradeDay(
    lines,
    packMeta.dateIso,
    packMeta.previewDate,
  )
  const linkTrading =
    mode === 'upcoming'
      ? shouldLinkCashbackToTradingOrders(sourceId)
      : shouldLinkCashbackPreview(sourceId) || shouldLinkCashbackFeed(sourceId)
  const count = resolveCashbackOrderCount(total, currency, linkTrading)
  const legParts = splitMoneyTotal(total, count, currency)
  const account = extractAccountFromLines(lines)
  const accountOrderBase = cashbackOrderBaseForAccount(account, linkTrading)
  const orderListDate =
    packMeta.previewDate != null
      ? formatListDateTimeLoose(packMeta.previewDate)
      : packMeta.groupDateLabel && packMeta.time
        ? formatListDateTimeLoose(
            `${packMeta.groupDateLabel.replace(/,\s*$/, '')}, ${packMeta.time}`,
          )
        : tradeDayListDate(lines)
  const orders = buildCashbackOrders(
    legParts,
    currency,
    tradeDay,
    orderListDate,
    orderIdPrefix,
    mode,
    account,
    {
      ...cashbackOrderBuildOptions(linkTrading),
      ...(accountOrderBase != null ? { orderBase: accountOrderBase } : {}),
    },
  )

  return {
    navTitle: packMeta.navTitle,
    chip: packMeta.chip,
    heroIcon: 'dollar',
    amount: formatSignedMoney(total, currency),
    details: cashbackPackDetailRows(packMeta.whenLabel, packMeta.whenValue, tradeDay, account),
    orders,
  }
}

export function buildCashbackPackFromUpcomingRow(row: LifecycleUpcomingItem): PackConfig {
  return buildCashbackPackFromMoney(row.id, row.id, row.amount, row.lines, 'upcoming', {
    navTitle: 'Upcoming cashback',
    chip: { text: 'Upcoming', tone: 'warning' },
    whenLabel: 'Credits on',
    whenValue: creditsOn(row.date),
    dateCol: row.date,
  })
}

export function buildCashbackPackFromFeedItem(
  item: ActivityFeedItem,
  groupDateLabel: string,
  time: string,
  dateIso: string,
): PackConfig {
  const creditedOn = formatModalDateTimeUtcFromDateAndTime(groupDateLabel, time)
  return buildCashbackPackFromMoney(
    item.id,
    `sim-feed-${item.id}`,
    item.amount,
    item.lines,
    'credited',
    {
    navTitle: 'EXD cashback',
    chip: { text: 'Credited', tone: 'success' },
    whenLabel: 'Credited on',
    whenValue: creditedOn,
    groupDateLabel,
    time,
    dateIso,
    },
  )
}

export function buildCashbackPackFromActivityPreview(row: LifecycleActivityPreviewItem): PackConfig {
  const creditedOn = formatModalDateTimeUtcLoose(row.date)
  return buildCashbackPackFromMoney(row.id, `sim-${row.id}`, row.amount, row.lines, 'credited', {
    navTitle: 'EXD cashback',
    chip: { text: 'Credited', tone: 'success' },
    whenLabel: 'Credited on',
    whenValue: creditedOn,
    previewDate: row.date,
  })
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
      const previewById = step.activityPreview.find(
        (p) => p.id === itemId && p.rewardModal === 'loyalty-activated',
      )
      if (previewById) return buildLoyaltyPackFromActivityPreview(previewById)
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
      const previewById = step.activityPreview.find(
        (p) => p.id === itemId && p.rewardModal === 'cashback-activated',
      )
      if (previewById) return buildCashbackPackFromActivityPreview(previewById)
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
  const count = inferOrderCount(total, row.badge)
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
