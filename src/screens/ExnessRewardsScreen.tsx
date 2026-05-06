import { useEffect, useMemo, useState, type Dispatch, type ReactNode, type SetStateAction } from 'react'
import {
  IconAlertTriangle,
  IconArrowRight,
  IconArrowsRightLeft,
  IconChevronLeft,
  IconChevronRight,
  IconCrown,
  IconCrownOff,
  IconCurrencyDollar,
  IconGift,
  IconInfoCircle,
  IconX,
} from '@tabler/icons-react'
import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import type {
  LifecycleActivityIcon,
  LifecycleActivityPreviewItem,
  LifecycleUpcomingItem,
} from '../rewardLifecycle/lifecycleSteps'
import type { ActivityTypeFilter } from './activityFeedTypes'
import type { RebateDemoState } from '../rewardLifecycle/rebateSimulatorSteps'
import {
  hasRebatePendingPayouts,
  parseSignedAmount,
  rebateNextChunk,
} from '../rewardLifecycle/rebateSimulatorSteps'
import styles from './ExnessRewardsScreen.module.css'

function filterV1RebateRowsForDisplay(
  rows: LifecycleUpcomingItem[],
  rebate: RebateDemoState,
): LifecycleUpcomingItem[] {
  return rows.filter((row) => {
    if (row.id === 'v1-cash-rebates') {
      return hasRebatePendingPayouts(rebate) && parseSignedAmount(rebate.pendingUsd) > 0
    }
    if (row.id === 'v1-reward-rebates') {
      return hasRebatePendingPayouts(rebate) && parseSignedAmount(rebate.pendingExd) > 0
    }
    return true
  })
}

/** Временно скрываем бейдж в разметке (элемент в DOM остаётся). Поставь false, чтобы снова показать. */
const HIDE_TRANSACTION_BADGES = true

const TIER_EXD_GOAL = 1000
type SpreadPrototypeVariant = 'v1' | 'v2' | 'v3' | 'v4'

/** Парсит сумму из строки вида "+3.20 EXD" */
function parseExdFromAmountLabel(amount: string): number {
  const m = amount.replace(/,/g, '').match(/([+-]?\d+(?:\.\d+)?)\s*EXD/i)
  if (!m) return 0
  const n = parseFloat(m[1])
  return Number.isFinite(n) ? n : 0
}

function SectionTitle({
  title,
  showChevron = true,
  onClick,
}: {
  title: string
  showChevron?: boolean
  onClick?: () => void
}) {
  const inner = (
    <>
      <span className={styles.sectionTitle} role="heading" aria-level={2}>
        {title}
      </span>
      {showChevron ? (
        <IconChevronRight className={styles.chevronIcon} size={24} stroke={2} aria-hidden />
      ) : null}
    </>
  )

  if (showChevron) {
    return (
      <button type="button" className={styles.sectionTitleRow} onClick={onClick}>
        {inner}
      </button>
    )
  }

  return <div className={`${styles.sectionTitleRow} ${styles.sectionTitleRowStatic}`}>{inner}</div>
}

/** Заголовок секции Upcoming для V2 — Figma 48965:88125 (H3 + count badge; шеврон опционален). */
function V2UpcomingSectionTitle({
  badgeCount,
  onOpenAll,
  showChevron = true,
}: {
  badgeCount: number
  onOpenAll: () => void
  showChevron?: boolean
}) {
  return (
    <button type="button" className={styles.v2SectionTitleRow} onClick={onOpenAll}>
      <span className={styles.v2SectionTitleLeft}>
        <span className={styles.v2SectionTitleText} role="heading" aria-level={2}>
          Upcoming
        </span>
        <span className={styles.v2SectionTitleBadge} aria-label={`${badgeCount} items`}>
          {badgeCount}
        </span>
      </span>
      {showChevron ? (
        <IconChevronRight className={styles.chevronIcon} size={24} stroke={2} aria-hidden />
      ) : null}
    </button>
  )
}

/** Полный drill-in Upcoming (Figma 48965:89084 / 89743) — общий для V2 и V4. */
function FlexibleUpcomingDrillIn({
  onBack,
  rebateDemo,
  drillProgram,
  drillEquity,
  setDrillProgram,
  setDrillEquity,
  drillGroups,
  usdTotalLabel,
  showUsdTotalBar,
  onOpenRebateLedger,
  fullPage = false,
}: {
  onBack: () => void
  rebateDemo: RebateDemoState
  drillProgram: V2DrillProgramFilter
  drillEquity: V2DrillEquityFilter
  setDrillProgram: Dispatch<SetStateAction<V2DrillProgramFilter>>
  setDrillEquity: Dispatch<SetStateAction<V2DrillEquityFilter>>
  drillGroups: V2DrillGroup[]
  usdTotalLabel: string
  showUsdTotalBar: boolean
  onOpenRebateLedger?: () => void
  /** Отдельный экран без hero и прочих секций (Figma drill-in). */
  fullPage?: boolean
}) {
  const shellClass = fullPage ? `${styles.v2DrillShell} ${styles.v2DrillShellFullPage}` : styles.v2DrillShell
  const hasRebate = hasRebatePendingPayouts(rebateDemo)
  return (
    <>
      {!fullPage ? <div className={styles.sectionSpacer} aria-hidden /> : null}
      <div className={shellClass}>
        <div className={styles.v2DrillTop}>
          <button type="button" className={styles.v2InnerBack} onClick={onBack} aria-label="Back">
            <IconChevronLeft size={22} stroke={2} aria-hidden />
          </button>
        </div>
        <p className={styles.v2ExpandedTitle}>Upcoming</p>
        <div className={styles.v2ChipRowsStack}>
          <p className={styles.v2FilterSectionLabel}>Program type</p>
          <div className={styles.v2ChipRow}>
            {(['all', 'loyalty', 'rebates'] as const).map((key) => (
              <button
                key={key}
                type="button"
                className={`${styles.v2Chip} ${drillProgram === key ? styles.v2ChipActive : ''}`}
                disabled={key === 'rebates' && !hasRebate}
                onClick={() => {
                  if (key === 'rebates' && !hasRebate) return
                  setDrillProgram(key)
                }}
              >
                {key === 'all' ? 'All' : key === 'loyalty' ? 'Loyalty' : 'Rebates'}
              </button>
            ))}
          </div>
          <p className={styles.v2FilterSectionLabel}>Equity type</p>
          <div className={styles.v2ChipRow}>
            {(['all', 'usd', 'exd'] as const).map((key) => (
              <button
                key={key}
                type="button"
                className={`${styles.v2Chip} ${drillEquity === key ? styles.v2ChipActive : ''}`}
                disabled={key !== 'all' && !hasRebate}
                onClick={() => {
                  if (key !== 'all' && !hasRebate) return
                  setDrillEquity(key)
                }}
              >
                {key === 'all' ? 'All' : key.toUpperCase()}
              </button>
            ))}
          </div>
        </div>
        {showUsdTotalBar ? (
          <div className={styles.v2TotalBar}>
            <span className={styles.v2TotalBarLabel}>Total upcoming USD rebates:</span>
            <span className={styles.v2TotalBarAmount}>{usdTotalLabel}</span>
          </div>
        ) : null}
        <div className={styles.v2AllPage}>
          {drillGroups.map((group) => (
            <div key={group.id} className={styles.v2DrillGroup}>
              <p className={styles.v2DateHeading}>{group.heading}</p>
              {group.rows.map((row) => (
                <V2UpcomingRow key={row.id} row={row} onOpenRebateLedger={onOpenRebateLedger} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

function SpreadPrototypeVariantStrip({
  spreadVariant,
  onSpreadVariantChange,
}: {
  spreadVariant: SpreadPrototypeVariant
  onSpreadVariantChange: (v: SpreadPrototypeVariant) => void
}) {
  const variants: { id: SpreadPrototypeVariant; short: string; hint: string }[] = [
    { id: 'v1', short: 'V1', hint: 'In Upcoming' },
    { id: 'v2', short: 'V2', hint: 'Flexible Upcoming' },
    { id: 'v3', short: 'V3', hint: 'Separate widget' },
    { id: 'v4', short: 'V4', hint: 'Hybrid section' },
  ]
  return (
    <div
      className={styles.prototypeVariantStrip}
      role="group"
      aria-label="Spread rebate layout prototype"
    >
      {variants.map(({ id, short, hint }) => (
        <button
          key={id}
          type="button"
          title={hint}
          className={`${styles.prototypeVariantChip} ${
            spreadVariant === id ? styles.prototypeVariantChipActive : ''
          }`}
          onClick={() => onSpreadVariantChange(id)}
        >
          {short}
        </button>
      ))}
    </div>
  )
}

type TxProps = {
  icon: ReactNode
  title: string
  amount: string
  lines: string[]
  date: string
  badge?: string
  onOpenDetail?: () => void
}

type V2UpcomingRowData = {
  id: string
  icon: LifecycleActivityIcon
  title: string
  amount: string
  line1: string
  line2?: string
  /** Правая колонка (дата); пусто — как в Figma drill-in для части строк. */
  date: string
  /** Лейбл «Pinned» (старый прототип); в V2 по Figma не используем. */
  pinned?: boolean
  /** iOS badge с числом (Figma 48965:88125). */
  countBadge?: string
  /** Открыть леджер spread rebate (прототип). */
  opensRebateLedger?: boolean
  /** Фильтр drill-in: блок Loyalty vs Rebates. */
  filterProgram?: 'loyalty' | 'rebates'
  /** Фильтр drill-in: USD vs EXD. */
  filterEquity?: 'usd' | 'exd'
}

type V2DrillProgramFilter = 'all' | 'loyalty' | 'rebates'
type V2DrillEquityFilter = 'all' | 'usd' | 'exd'

type V2DrillGroup = {
  id: string
  heading: string
  rows: V2UpcomingRowData[]
}

const V2_DRILL_DATE_HEADINGS = [
  'Tomorrow',
  '7 May 2026',
  '14 May 2026',
  '21 May 2026',
  '28 May 2026',
  '4 Jun 2026',
] as const

/** По одной строке на слот pendingCount для USD и для EXD (30+30 или 60+60). */
function buildV2RebateSlotRows(rebate: RebateDemoState): V2UpcomingRowData[] {
  if (!hasRebatePendingPayouts(rebate)) return []
  const n = Math.max(0, Math.floor(Number(rebate.pendingCount)))
  if (n === 0) return []
  const usdChunk = rebateNextChunk(rebate.pendingUsd, n, 'USD')
  const exdChunk = rebateNextChunk(rebate.pendingExd, n, 'EXD')
  const dateStr =
    rebate.nextPayoutDate === '—'
      ? ''
      : rebate.nextPayoutDate === 'Tomorrow'
        ? 'Tomorrow'
        : rebate.nextPayoutDate.startsWith('on ')
          ? rebate.nextPayoutDate
          : `on ${rebate.nextPayoutDate}`

  const rows: V2UpcomingRowData[] = []
  for (let i = 0; i < n; i++) {
    rows.push({
      id: `v2-slot-usd-${i}`,
      icon: 'dollar',
      title: 'Cash rebates',
      amount: usdChunk,
      line1: `Payout slot ${i + 1} of ${n} · USD`,
      date: dateStr,
      opensRebateLedger: true,
      filterProgram: 'rebates',
      filterEquity: 'usd',
    })
    rows.push({
      id: `v2-slot-exd-${i}`,
      icon: 'crown',
      title: 'EXD rebates',
      amount: exdChunk,
      line1: `Payout slot ${i + 1} of ${n} · EXD`,
      date: dateStr,
      opensRebateLedger: true,
      filterProgram: 'rebates',
      filterEquity: 'exd',
    })
  }
  return rows
}

function filterV2DrillRows(
  rows: V2UpcomingRowData[],
  program: V2DrillProgramFilter,
  equity: V2DrillEquityFilter,
): V2UpcomingRowData[] {
  return rows.filter((row) => {
    const p = row.filterProgram
    const e = row.filterEquity
    if (program !== 'all') {
      if (!p || p !== program) return false
    }
    if (equity !== 'all') {
      if (!e || e !== equity) return false
    }
    return true
  })
}

function bucketRowsIntoV2DrillGroups(rows: V2UpcomingRowData[]): V2DrillGroup[] {
  if (rows.length === 0) return []
  const k = V2_DRILL_DATE_HEADINGS.length
  const buckets: V2DrillGroup[] = V2_DRILL_DATE_HEADINGS.map((heading, idx) => ({
    id: `drill-grp-${idx}`,
    heading,
    rows: [],
  }))
  rows.forEach((row, i) => {
    buckets[i % k].rows.push(row)
  })
  return buckets.filter((g) => g.rows.length > 0)
}

function TransactionRow({
  icon,
  title,
  amount,
  lines,
  date,
  badge,
  onOpenDetail,
}: TxProps) {
  const inner = (
    <>
      <div className={styles.txIcon}>{icon}</div>
      <div className={styles.txBody}>
        <div className={styles.txHead}>
          {badge ? (
            <div className={styles.txTitleWithBadge}>
              <p className={styles.txTitle}>{title}</p>
              <span
                className={`${styles.badge} ${HIDE_TRANSACTION_BADGES ? styles.badgeHidden : ''}`}
              >
                {badge}
              </span>
            </div>
          ) : (
            <p className={styles.txTitle}>{title}</p>
          )}
          <p className={styles.txAmount}>{amount}</p>
        </div>
        <div className={styles.txDescRow}>
          <div className={styles.txDesc}>
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className={styles.txDate}>{date}</p>
        </div>
      </div>
    </>
  )

  if (onOpenDetail) {
    return (
      <button type="button" className={styles.txClickable} onClick={onOpenDetail}>
        {inner}
      </button>
    )
  }

  return <div className={styles.tx}>{inner}</div>
}

function V2UpcomingRow({
  row,
  onOpenRebateLedger,
}: {
  row: V2UpcomingRowData
  onOpenRebateLedger?: () => void
}) {
  const dateCell =
    row.date.trim().length > 0 ? (
      <p className={styles.v2RowDate}>{row.date}</p>
    ) : (
      <span className={styles.v2RowDateSpacer} aria-hidden />
    )

  const body = (
    <>
      <div className={styles.v2RowIcon}>
        <RowIconTabler kind={row.icon} />
      </div>
      <div className={styles.v2RowBody}>
        <div className={styles.v2RowHead}>
          <p className={styles.v2RowTitle}>
            {row.title}
            {row.countBadge ? (
              <span className={styles.v2CountBadge}>{row.countBadge}</span>
            ) : null}
            {row.pinned && !row.countBadge ? <span className={styles.v2PinTag}>Pinned</span> : null}
          </p>
          <p className={styles.v2RowAmount}>{row.amount}</p>
        </div>
        <div className={styles.v2RowDesc}>
          <div className={styles.v2RowText}>
            <p>{row.line1}</p>
            {row.line2 ? <p>{row.line2}</p> : null}
          </div>
          {dateCell}
        </div>
      </div>
    </>
  )

  if (row.opensRebateLedger && onOpenRebateLedger) {
    return (
      <button type="button" className={styles.v2RowBtn} onClick={onOpenRebateLedger}>
        {body}
      </button>
    )
  }

  return <div className={styles.v2Row}>{body}</div>
}

function RowIconTabler({ kind }: { kind: LifecycleActivityIcon }) {
  const common = { size: 24 as const, stroke: 1.75 as const, 'aria-hidden': true as const }
  switch (kind) {
    case 'dollar':
      return <IconCurrencyDollar {...common} />
    case 'crown':
      return <IconCrown {...common} />
    case 'gift':
      return <IconGift {...common} />
    case 'transfer':
      return <IconArrowsRightLeft {...common} />
    case 'crownOff':
      return <IconCrownOff {...common} />
    default:
      return null
  }
}

type ExnessRewardsScreenProps = {
  spreadVariant: SpreadPrototypeVariant
  /** Переключение V1–V4 внутри макета телефона (дублирует панель сбоку). */
  onSpreadVariantChange?: (variant: SpreadPrototypeVariant) => void
  /** Сброс dismiss V2 alert при смене сценария симулятора. */
  rebateScenarioId: string
  rebateDemo: RebateDemoState
  /** `category: 'cashback'` — с Lifetime cashback; без opts — с Activity feed */
  onOpenActivityFeed?: (opts?: { category?: ActivityTypeFilter }) => void
  onOpenRebateLedger?: () => void
  onOpenRewardModal?: (variant: RewardModalVariant, feedItemId?: string) => void
  availableRewardsExd: string
  tradingWalletLabel: string
  tradingWalletValue: string
  tradingWalletMuted: boolean
  lifetimeCashbackUsd: string
  /** Накопительный заработанный EXD для тира (не падает при списании EXD на rebate). */
  tierEarnedExdTowardGoal: number
  upcomingItems: LifecycleUpcomingItem[]
  activityPreviewItems: LifecycleActivityPreviewItem[]
}

export function ExnessRewardsScreen({
  spreadVariant,
  onSpreadVariantChange,
  rebateScenarioId,
  rebateDemo,
  onOpenActivityFeed,
  onOpenRebateLedger,
  onOpenRewardModal,
  availableRewardsExd,
  tradingWalletLabel,
  tradingWalletValue,
  tradingWalletMuted,
  lifetimeCashbackUsd,
  tierEarnedExdTowardGoal,
  upcomingItems,
  activityPreviewItems,
}: ExnessRewardsScreenProps) {
  const [flexUpcomingDrillOpen, setFlexUpcomingDrillOpen] = useState(false)
  const [v2DrillProgram, setV2DrillProgram] = useState<V2DrillProgramFilter>('all')
  const [v2DrillEquity, setV2DrillEquity] = useState<V2DrillEquityFilter>('all')
  const [v2AlertDismissed, setV2AlertDismissed] = useState(false)
  const availableExdAmount = parseFloat(
    availableRewardsExd.replace(/,/g, '').trim().split(/\s+/)[0] ?? '0',
  )
  const canTransferToAccount =
    Number.isFinite(availableExdAmount) && availableExdAmount > 0

  const upcomingLoyaltyExd = useMemo(
    () =>
      upcomingItems
        .filter((row) => row.icon === 'crown')
        .reduce((sum, row) => sum + Math.max(0, parseExdFromAmountLabel(row.amount)), 0),
    [upcomingItems],
  )

  /**
   * «Earn 1000 EXD»: заработанные награды (не уменьшаются при списании EXD) + loyalty в Upcoming.
   * Cashback USD в прогресс EXD не входит.
   */
  const tierProgressExd = useMemo(() => {
    const earned = Number.isFinite(tierEarnedExdTowardGoal)
      ? Math.max(0, tierEarnedExdTowardGoal)
      : 0
    return earned + upcomingLoyaltyExd
  }, [tierEarnedExdTowardGoal, upcomingLoyaltyExd])

  const tierProgressPct = Math.min(100, (tierProgressExd / TIER_EXD_GOAL) * 100)
  const tierFillWidthPct =
    tierProgressExd > 0 && tierProgressPct < 0.4 ? 0.4 : tierProgressPct
  const tierProgressLabel = Number.isInteger(tierProgressExd)
    ? `${tierProgressExd}`
    : tierProgressExd.toLocaleString('en-US', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 2,
      })

  const v1NextUsdPayout = useMemo(
    () => rebateNextChunk(rebateDemo.pendingUsd, rebateDemo.pendingCount, 'USD'),
    [rebateDemo.pendingUsd, rebateDemo.pendingCount],
  )
  const v1NextExdPayout = useMemo(
    () => rebateNextChunk(rebateDemo.pendingExd, rebateDemo.pendingCount, 'EXD'),
    [rebateDemo.pendingExd, rebateDemo.pendingCount],
  )

  const hasRebate = hasRebatePendingPayouts(rebateDemo)

  useEffect(() => {
    setFlexUpcomingDrillOpen(false)
    setV2DrillProgram('all')
    setV2DrillEquity('all')
    if (spreadVariant !== 'v2') {
      setV2AlertDismissed(false)
    }
  }, [spreadVariant])

  useEffect(() => {
    if (!flexUpcomingDrillOpen) {
      setV2DrillProgram('all')
      setV2DrillEquity('all')
    }
  }, [flexUpcomingDrillOpen])

  useEffect(() => {
    if (!hasRebatePendingPayouts(rebateDemo)) {
      setV2DrillProgram((p) => (p === 'rebates' ? 'all' : p))
      setV2DrillEquity((e) => (e !== 'all' ? 'all' : e))
    }
  }, [rebateDemo])

  useEffect(() => {
    setV2AlertDismissed(false)
  }, [rebateScenarioId])

  const v1UpcomingRows: LifecycleUpcomingItem[] = useMemo(() => {
    const base: LifecycleUpcomingItem[] = [
      {
        id: 'v1-loyalty-cashback',
        icon: 'dollar',
        title: 'Loyalty cashback',
        amount: '+0.64 USD',
        lines: ['For daily trading'],
        date: 'Tomorrow',
        rewardModal: 'cashback-upcoming',
      },
      {
        id: 'v1-loyalty-rewards',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.70 EXD',
        lines: ['For weekly trading'],
        date: 'on Jan 17',
        rewardModal: 'loyalty-upcoming',
      },
    ]
    const extra: LifecycleUpcomingItem[] = []
    if (
      hasRebatePendingPayouts(rebateDemo) &&
      parseSignedAmount(rebateDemo.pendingUsd) > 0
    ) {
      extra.push({
        id: 'v1-cash-rebates',
        icon: 'dollar',
        title: 'Cash rebates',
        amount: rebateDemo.pendingUsd,
        lines: [
          `${rebateDemo.pendingCount} pending payouts`,
          rebateDemo.nextPayoutDate === 'Tomorrow'
            ? `Next ${v1NextUsdPayout} tomorrow`
            : `Next ${v1NextUsdPayout} on ${rebateDemo.nextPayoutDate}`,
        ],
        date: 'In queue',
        rewardModal: 'cashback-upcoming',
      })
    }
    if (
      hasRebatePendingPayouts(rebateDemo) &&
      parseSignedAmount(rebateDemo.pendingExd) > 0
    ) {
      extra.push({
        id: 'v1-reward-rebates',
        icon: 'crown',
        title: 'Reward rebates',
        amount: rebateDemo.pendingExd,
        lines: [
          `${rebateDemo.pendingCount} pending payouts`,
          rebateDemo.nextPayoutDate === 'Tomorrow'
            ? `Next ${v1NextExdPayout} tomorrow`
            : `Next ${v1NextExdPayout} on ${rebateDemo.nextPayoutDate}`,
        ],
        date: 'In queue',
        rewardModal: 'loyalty-upcoming',
      })
    }
    return [...base, ...extra]
  }, [rebateDemo, v1NextUsdPayout, v1NextExdPayout])

  const showUpcomingBlock =
    spreadVariant !== 'v2' &&
    spreadVariant !== 'v4' &&
    (spreadVariant === 'v1' || upcomingItems.length > 0)

  const spreadPreviewUsd = useMemo(
    () => rebateNextChunk(rebateDemo.pendingUsd, rebateDemo.pendingCount, 'USD'),
    [rebateDemo.pendingUsd, rebateDemo.pendingCount],
  )
  const spreadPreviewExd = useMemo(
    () => rebateNextChunk(rebateDemo.pendingExd, rebateDemo.pendingCount, 'EXD'),
    [rebateDemo.pendingExd, rebateDemo.pendingCount],
  )
  const spreadDateLabel =
    rebateDemo.nextPayoutDate === '—'
      ? '—'
      : rebateDemo.nextPayoutDate === 'Tomorrow'
        ? 'Tomorrow'
        : `on ${rebateDemo.nextPayoutDate}`

  /** Правая колонка для строк ребейта (календарная выплата), Figma CE-3188. */
  const v2RebatePayoutCol =
    rebateDemo.nextPayoutDate === '—'
      ? ''
      : rebateDemo.nextPayoutDate === 'Tomorrow'
        ? 'on May 15'
        : rebateDemo.nextPayoutDate.startsWith('on ')
          ? rebateDemo.nextPayoutDate
          : `on ${rebateDemo.nextPayoutDate}`

  const v2PinnedRows: V2UpcomingRowData[] = useMemo(
    () => [
      {
        id: 'pin-exd-cashback',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+0.64 USD',
        line1: 'For daily trading',
        date: 'Tomorrow',
      },
      {
        id: 'pin-loyalty',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.70 EXD',
        line1: 'For weekly trading',
        date: 'on Jan 17',
        countBadge: '2',
      },
    ],
    [],
  )

  const v2SpreadPreviewRows: V2UpcomingRowData[] = useMemo(() => {
    if (!hasRebatePendingPayouts(rebateDemo)) return []
    const n = Math.floor(Number(rebateDemo.pendingCount))
    return [
      {
        id: 'pin-cash-rebates',
        icon: 'dollar',
        title: 'Cash rebates',
        amount: spreadPreviewUsd,
        line1: `From ${n} payout slots · USD`,
        date: v2RebatePayoutCol,
        opensRebateLedger: true,
      },
      {
        id: 'pin-exd-rebates',
        icon: 'crown',
        title: 'EXD rebates',
        amount: spreadPreviewExd,
        line1: `From ${n} payout slots · EXD`,
        date: v2RebatePayoutCol,
        opensRebateLedger: true,
      },
    ]
  }, [rebateDemo, spreadPreviewExd, spreadPreviewUsd, v2RebatePayoutCol])

  const v2DrillLoyaltyRows: V2UpcomingRowData[] = useMemo(
    () => [
      {
        id: 'drill-exd-cashback',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+0.64 USD',
        line1: 'For daily trading',
        date: 'Tomorrow',
        filterProgram: 'loyalty',
        filterEquity: 'usd',
      },
      {
        id: 'drill-loyalty-rewards',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.70 EXD',
        line1: 'For weekly trading',
        date: 'on Jan 17',
        countBadge: '2',
        filterProgram: 'loyalty',
        filterEquity: 'exd',
      },
    ],
    [],
  )

  const v2DrillSlotRows = useMemo(() => buildV2RebateSlotRows(rebateDemo), [rebateDemo])

  const v2DrillAllFlatRows = useMemo(
    () => [...v2DrillLoyaltyRows, ...v2DrillSlotRows],
    [v2DrillLoyaltyRows, v2DrillSlotRows],
  )

  const v2DrillGroupsVisible = useMemo(
    () =>
      bucketRowsIntoV2DrillGroups(
        filterV2DrillRows(v2DrillAllFlatRows, v2DrillProgram, v2DrillEquity),
      ),
    [v2DrillAllFlatRows, v2DrillProgram, v2DrillEquity],
  )

  const v2DrillShowUsdTotalBar =
    hasRebatePendingPayouts(rebateDemo) &&
    v2DrillProgram !== 'loyalty' &&
    v2DrillEquity !== 'exd' &&
    parseSignedAmount(rebateDemo.pendingUsd) > 0

  const v2BadgeCount = useMemo(() => {
    const pinned = v2PinnedRows.length
    const slots = hasRebatePendingPayouts(rebateDemo)
      ? Math.max(0, Math.floor(Number(rebateDemo.pendingCount))) * 2
      : 0
    return pinned + slots
  }, [rebateDemo, v2PinnedRows])

  const v4UpcomingRows: V2UpcomingRowData[] = useMemo(() => {
    const base: V2UpcomingRowData[] = [
      {
        id: 'v4-cashback',
        icon: 'dollar',
        title: 'Cashback',
        amount: '+0.64 USD',
        line1: 'For daily trading',
        date: 'Tomorrow',
      },
      {
        id: 'v4-loyalty',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.70 EXD',
        line1: 'For weekly trading',
        date: 'on Jan 17',
      },
    ]
    if (!hasRebatePendingPayouts(rebateDemo)) return base
    return [
      ...base,
      {
        id: 'v4-spread-usd',
        icon: 'dollar',
        title: 'Spread rebates',
        amount: spreadPreviewUsd,
        line1: 'Closest payout',
        line2: `From ${rebateDemo.pendingCount} payout slots`,
        date: spreadDateLabel,
        opensRebateLedger: true,
      },
      {
        id: 'v4-spread-exd',
        icon: 'crown',
        title: 'Spread rebates',
        amount: spreadPreviewExd,
        line1: 'Closest payout',
        line2: `From ${rebateDemo.pendingCount} payout slots`,
        date: spreadDateLabel,
        opensRebateLedger: true,
      },
    ]
  }, [rebateDemo, spreadDateLabel, spreadPreviewExd, spreadPreviewUsd])

  const showV4SpreadSection =
    hasRebatePendingPayouts(rebateDemo) ||
    rebateDemo.showAccountAlert ||
    rebateDemo.usdAccountSelected

  const flexibleDrillFullPage =
    flexUpcomingDrillOpen && (spreadVariant === 'v2' || spreadVariant === 'v4')

  if (flexibleDrillFullPage) {
    return (
      <div className={`${styles.screen} ${styles.screenDrillOnly}`} data-node-id="42104:10683">
        <div className={styles.flexDrillPageRoot}>
          <FlexibleUpcomingDrillIn
            fullPage
            onBack={() => setFlexUpcomingDrillOpen(false)}
            rebateDemo={rebateDemo}
            drillProgram={v2DrillProgram}
            drillEquity={v2DrillEquity}
            setDrillProgram={setV2DrillProgram}
            setDrillEquity={setV2DrillEquity}
            drillGroups={v2DrillGroupsVisible}
            usdTotalLabel={rebateDemo.pendingUsd}
            showUsdTotalBar={v2DrillShowUsdTotalBar}
            onOpenRebateLedger={onOpenRebateLedger}
          />
        </div>
      </div>
    )
  }

  return (
    <div className={styles.screen} data-node-id="42104:10683">
      <div className={styles.hero}>
        <div className={styles.heroBg} aria-hidden>
          <div className={styles.heroGlow} />
          <div className={styles.heroBlurBottom} />
        </div>

        <div className={styles.statusBar}>
          <span className={styles.statusTime}>9:41</span>
          <span className={styles.statusRight} aria-hidden />
        </div>

        <header className={styles.topNav}>
          <button type="button" className={styles.navBtn} aria-label="Back">
            <IconChevronLeft size={24} stroke={2} aria-hidden />
          </button>
          <h1 className={styles.navTitle}>Exness Rewards</h1>
          <button type="button" className={styles.navBtn} aria-label="Information">
            <IconInfoCircle size={24} stroke={2} aria-hidden />
          </button>
        </header>

        <div className={styles.tierBlock}>
          <div>
            <p className={styles.currentLabel}>Current status</p>
            <div className={styles.tierTitleRow}>
              <p className={styles.tierName}>Ultimate</p>
              <span className={styles.chipX2}>
                <IconCrown size={16} stroke={1.75} aria-hidden />
                x2
              </span>
              <button type="button" className={styles.chevronBtn} aria-label="Tier details">
                <IconChevronRight size={24} stroke={2} aria-hidden />
              </button>
            </div>
          </div>

          <div className={styles.progressCard}>
            <div className={styles.progressRow}>
              <span className={styles.progressRowText}>
                Maintain <span className={styles.progressTierName}>Ultimate</span>
              </span>
              <span className={styles.daysLeft}>30 days left</span>
            </div>
            <div className={styles.progressExdBlock}>
              <div className={styles.exdRow}>
                <span>Earn {TIER_EXD_GOAL} EXD</span>
                <span className={styles.exdMeta}>
                  {tierProgressLabel}/{TIER_EXD_GOAL}
                </span>
              </div>
              {/* Tier Linear: накопительный заработанный EXD + loyalty в Upcoming */}
              <div
                className={styles.tierLinear}
                role="progressbar"
                aria-valuenow={Math.round(tierProgressPct)}
                aria-valuemin={0}
                aria-valuemax={100}
                aria-label={`Tier EXD progress, ${tierProgressLabel} of ${TIER_EXD_GOAL} EXD (earned rewards plus upcoming loyalty, spending does not reduce)`}
              >
                <div className={styles.tierLinearTrack}>
                  <div
                    className={styles.tierLinearFill}
                    style={{ width: `${tierFillWidthPct}%` }}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={styles.body}>
        {onSpreadVariantChange ? (
          <SpreadPrototypeVariantStrip
            spreadVariant={spreadVariant}
            onSpreadVariantChange={onSpreadVariantChange}
          />
        ) : null}
        <div className={styles.walletsSection}>
          <div className={styles.walletsScroll} role="region" aria-label="Reward wallets">
            <article className={styles.walletCard}>
              <div>
                <p className={styles.walletLabel}>Available rewards</p>
                <p className={styles.walletValue}>{availableRewardsExd}</p>
              </div>
              <button
                type="button"
                className={styles.transferBtn}
                disabled={!canTransferToAccount}
              >
                Transfer to account
              </button>
            </article>
            <article
              className={`${styles.walletCard} ${tradingWalletMuted ? styles.walletCardMuted : ''}`}
            >
              <div>
                <p className={styles.walletLabel}>{tradingWalletLabel}</p>
                <p className={styles.walletValue}>{tradingWalletValue}</p>
              </div>
              <button type="button" className={styles.iconCircleBtn} aria-label="Next">
                <IconArrowRight size={16} stroke={2} aria-hidden />
              </button>
            </article>
            <div className={styles.walletsScrollEnd} aria-hidden />
          </div>
        </div>

        <div className={styles.sectionSpacer} aria-hidden />
        <SectionTitle title="How to earn rewards" />
        <div className={styles.banner}>
          <div className={styles.bannerText}>
            <p className={styles.bannerTitle}>Get 1% back from every trade</p>
            <p className={styles.bannerDesc}>
              Get 1% in USD and 1% in EXD from daily spread. Payout arrives in 60 days.
            </p>
          </div>
          <div className={styles.bannerArt} aria-hidden>
            💸
          </div>
        </div>

        {spreadVariant === 'v2' && !flexUpcomingDrillOpen ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <V2UpcomingSectionTitle
              badgeCount={v2BadgeCount}
              showChevron={false}
              onOpenAll={() => setFlexUpcomingDrillOpen(true)}
            />
            <div className={styles.v2List}>
              {v2PinnedRows.map((row) => (
                <V2UpcomingRow key={row.id} row={row} onOpenRebateLedger={onOpenRebateLedger} />
              ))}
              {rebateDemo.showAccountAlert && !v2AlertDismissed ? (
                <div className={styles.v2Alert}>
                  <div className={styles.v2AlertIcon}>
                    <IconAlertTriangle size={20} stroke={2} aria-hidden />
                  </div>
                  <div className={styles.v2AlertBody}>
                    <p className={styles.v2AlertTitle}>Select account for USD</p>
                    <p className={styles.v2AlertDesc}>
                      {rebateDemo.onHoldUsdAmount} is waiting until account is selected.
                    </p>
                    <button type="button" className={styles.v2AlertBtn}>
                      Select account
                    </button>
                  </div>
                  <button
                    type="button"
                    className={styles.v2AlertClose}
                    aria-label="Dismiss"
                    onClick={() => setV2AlertDismissed(true)}
                  >
                    <IconX size={18} stroke={2} aria-hidden />
                  </button>
                </div>
              ) : null}
              {v2SpreadPreviewRows.map((row) => (
                <V2UpcomingRow key={row.id} row={row} onOpenRebateLedger={onOpenRebateLedger} />
              ))}
            </div>
          </>
        ) : null}

        {showUpcomingBlock ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle title="Upcoming" showChevron={spreadVariant === 'v1'} />
            {(spreadVariant === 'v1'
              ? filterV1RebateRowsForDisplay(v1UpcomingRows, rebateDemo)
              : upcomingItems
            ).map((row) => (
              <TransactionRow
                key={row.id}
                icon={<RowIconTabler kind={row.icon} />}
                title={row.title}
                amount={row.amount}
                lines={row.lines}
                date={row.date}
                badge={row.badge}
                onOpenDetail={
                  onOpenRebateLedger &&
                  (row.id === 'v1-cash-rebates' || row.id === 'v1-reward-rebates')
                    ? () => onOpenRebateLedger()
                    : onOpenRewardModal
                      ? () => onOpenRewardModal(row.rewardModal)
                      : undefined
                }
              />
            ))}
          </>
        ) : null}

        {spreadVariant === 'v3' && (hasRebate || rebateDemo.showAccountAlert) ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle title="Spread rebate" showChevron={false} />
            {hasRebate ? (
              <div
                className={styles.spreadWidgetTap}
                role="button"
                tabIndex={0}
                aria-label="Open spread rebate payout slots"
                onClick={() => onOpenRebateLedger?.()}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault()
                    onOpenRebateLedger?.()
                  }
                }}
              >
                <div className={styles.spreadWidget}>
                  <div className={styles.spreadWidgetHead}>
                    <p className={styles.spreadWidgetMeta}>60-day payout pipeline</p>
                    <p className={styles.spreadWidgetNext}>Next: {rebateDemo.nextPayoutDate}</p>
                  </div>
                  <div className={styles.spreadWidgetTotals}>
                    <div>
                      <p className={styles.spreadWidgetLabel}>Upcoming EXD</p>
                      <p className={styles.spreadWidgetValue}>{rebateDemo.pendingExd}</p>
                    </div>
                    <div>
                      <p className={styles.spreadWidgetLabel}>Upcoming USD</p>
                      <p className={styles.spreadWidgetValue}>{rebateDemo.pendingUsd}</p>
                    </div>
                  </div>
                  <p className={styles.spreadWidgetHint}>
                    {rebateDemo.pendingCount} payouts pending in total
                  </p>
                  {rebateDemo.showAccountAlert ? (
                    <div className={styles.spreadWidgetWarn}>
                      <p className={styles.spreadWidgetWarnTitle}>USD account is not selected</p>
                      <p className={styles.spreadWidgetWarnHint}>
                        {rebateDemo.onHoldUsdAmount} from {rebateDemo.onHoldUsdCount} mature payouts is
                        on hold. EXD already credited: {rebateDemo.paidExdAmount}.
                      </p>
                    </div>
                  ) : null}
                  <div className={styles.spreadWidgetFooter}>
                    {rebateDemo.showAccountAlert ? (
                      <span className={styles.spreadWidgetCta}>Select USD account</span>
                    ) : null}
                    <p className={styles.spreadWidgetTotalUsd}>
                      Total future USD incl. on-hold: {rebateDemo.totalWithOnHoldUsd}
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className={styles.spreadWidget}>
                <div className={styles.spreadWidgetHead}>
                  <p className={styles.spreadWidgetMeta}>60-day payout pipeline</p>
                  <p className={styles.spreadWidgetNext}>Next: {rebateDemo.nextPayoutDate}</p>
                </div>
                <div className={styles.spreadWidgetTotals}>
                  <div>
                    <p className={styles.spreadWidgetLabel}>Upcoming EXD</p>
                    <p className={styles.spreadWidgetValue}>{rebateDemo.pendingExd}</p>
                  </div>
                  <div>
                    <p className={styles.spreadWidgetLabel}>Upcoming USD</p>
                    <p className={styles.spreadWidgetValue}>{rebateDemo.pendingUsd}</p>
                  </div>
                </div>
                <p className={styles.spreadWidgetHint}>
                  {rebateDemo.pendingCount} payouts pending in total
                </p>
                {rebateDemo.showAccountAlert ? (
                  <div className={styles.spreadWidgetWarn}>
                    <p className={styles.spreadWidgetWarnTitle}>USD account is not selected</p>
                    <p className={styles.spreadWidgetWarnHint}>
                      {rebateDemo.onHoldUsdAmount} from {rebateDemo.onHoldUsdCount} mature payouts is
                      on hold. EXD already credited: {rebateDemo.paidExdAmount}.
                    </p>
                  </div>
                ) : null}
                <div className={styles.spreadWidgetFooter}>
                  {rebateDemo.showAccountAlert ? (
                    <button type="button" className={styles.spreadWidgetCta}>
                      Select USD account
                    </button>
                  ) : null}
                  <p className={styles.spreadWidgetTotalUsd}>
                    Total future USD incl. on-hold: {rebateDemo.totalWithOnHoldUsd}
                  </p>
                </div>
              </div>
            )}
          </>
        ) : null}

        {spreadVariant === 'v4' ? (
          <>
            {showV4SpreadSection ? (
              <>
                <div className={styles.sectionSpacer} aria-hidden />
                <SectionTitle
                  title="Spread rebates"
                  showChevron={hasRebate}
                  onClick={hasRebate ? () => onOpenRebateLedger?.() : undefined}
                />
                <div className={styles.v4Section}>
                  {rebateDemo.usdAccountSelected ? (
                    <div className={styles.v4AccountInfo}>
                      <p className={styles.v4AccountLabel}>USD destination account</p>
                      <p className={styles.v4AccountValue}>MT5 · #12345678</p>
                    </div>
                  ) : rebateDemo.showAccountAlert ? (
                    <div className={styles.v4Alert}>
                      <div className={styles.v4AlertIcon}>
                        <IconAlertTriangle size={20} stroke={2} aria-hidden />
                      </div>
                      <div className={styles.v4AlertBody}>
                        <p className={styles.v4AlertTitle}>Select account for USD</p>
                        <p className={styles.v4AlertDesc}>
                          {rebateDemo.onHoldUsdAmount} is waiting for account selection.
                        </p>
                        <button type="button" className={styles.v4AlertBtn}>
                          Select account
                        </button>
                      </div>
                    </div>
                  ) : null}
                  <div className={styles.v4Summary}>
                    <div className={styles.v4SummaryTop}>
                      <div>
                        <p className={styles.v4SummaryLabel}>Accumulated USD</p>
                        <p className={styles.v4SummaryValue}>{rebateDemo.pendingUsd}</p>
                      </div>
                      <div>
                        <p className={styles.v4SummaryLabel}>Accumulated EXD</p>
                        <p className={styles.v4SummaryValue}>{rebateDemo.pendingExd}</p>
                      </div>
                    </div>
                    <p className={styles.v4SummaryInfo}>
                      {rebateDemo.pendingCount} future payouts, nearest on {rebateDemo.nextPayoutDate}
                    </p>
                  </div>
                </div>
              </>
            ) : null}

            <div className={styles.sectionSpacer} aria-hidden />
            <V2UpcomingSectionTitle
              badgeCount={v4UpcomingRows.length}
              onOpenAll={() => setFlexUpcomingDrillOpen(true)}
            />
            <div className={styles.v4UpcomingList}>
              {v4UpcomingRows.map((row) => (
                <V2UpcomingRow
                  key={row.id}
                  row={row}
                  onOpenRebateLedger={onOpenRebateLedger}
                />
              ))}
            </div>
          </>
        ) : null}

        <div className={styles.sectionSpacer} aria-hidden />
        <SectionTitle
          title="Lifetime cashback"
          onClick={() => onOpenActivityFeed?.({ category: 'cashback' })}
        />
        <div className={styles.cashbackCard}>
          <p className={styles.cashbackLabel}>Your earned for all time</p>
          <p className={styles.cashbackValue}>{lifetimeCashbackUsd}</p>
          <div className={styles.cashbackCoin} aria-hidden>
            💵
          </div>
        </div>

        <div className={styles.sectionSpacer} aria-hidden />
        <SectionTitle title="Activity feed" onClick={() => onOpenActivityFeed?.()} />
        {activityPreviewItems.length === 0 ? (
          <p className={styles.emptyHint}>No transactions yet</p>
        ) : (
          activityPreviewItems.map((row) => (
            <TransactionRow
              key={row.id}
              icon={<RowIconTabler kind={row.icon} />}
              title={row.title}
              amount={row.amount}
              lines={row.lines}
              date={row.date}
              onOpenDetail={
                onOpenRewardModal ? () => onOpenRewardModal(row.rewardModal) : undefined
              }
            />
          ))
        )}

        <div className={styles.bottomSafe} aria-hidden />
      </div>
    </div>
  )
}
