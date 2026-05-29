import { useEffect, useMemo, useRef, useState, type ReactNode } from 'react'
import {
  IconArrowRight,
  IconArrowsRightLeft,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconCrown,
  IconInfoCircle,
} from '@tabler/icons-react'
import { RewardEventIcon } from '../components/ui/RewardEventIcon'
import { HIDE_TRANSACTION_BADGES } from '../domain/reward/featureFlags'
import { parseExdAmount, parseWalletExdBalance } from '../domain/reward/parseExd'
import type { RewardEventIcon as RewardEventIconKind } from '../domain/reward/types'
import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import type {
  LifecycleActivityPreviewItem,
  LifecycleUpcomingItem,
} from '../rewardLifecycle/lifecycleSteps'
import type { ActivityTypeFilter } from './activityFeedTypes'
import type { RebateDemoState } from '../rewardLifecycle/rebateSimulatorSteps'
import { hasRebatePendingPayouts, parseSignedAmount } from '../rewardLifecycle/rebateSimulatorSteps'
import styles from './ExnessRewardsScreen.module.css'

/** Временно скрываем бейдж — см. domain/reward/featureFlags.ts */
const TIER_EXD_GOAL = 1000
type V2SummaryCurrencyPage = 'usd' | 'exd'

/** Убирает знак +/-, оставляя формат суммы для UI-лейбла. */
function unsignedAmountLabel(amount: string): string {
  return amount.replace(/^\s*[+-]\s*/, '').trim()
}

function scrollDeviceFrameToTop(): void {
  if (typeof document === 'undefined') return
  const el = document.querySelector('.device-frame-scroll')
  if (el instanceof HTMLElement) el.scrollTo(0, 0)
}

function DrillScreenStatusBar() {
  return (
    <div className={styles.drillStatusBarBand}>
      <div className={styles.statusBar}>
        <span className={styles.statusTime}>9:41</span>
        <span className={styles.statusRight} aria-hidden />
      </div>
    </div>
  )
}

function fmtSignedAmount(value: number, currency: 'USD' | 'EXD'): string {
  return `+${value.toFixed(2)} ${currency}`
}

/** Upcoming USD в V2 Summary: без on-hold суммы (hold показывается только в алерте). */
function rebatePendingUsdExcludingHold(rebate: RebateDemoState): string {
  if (!rebate.showAccountAlert) return rebate.pendingUsd
  const pending = parseSignedAmount(rebate.pendingUsd)
  const hold = parseSignedAmount(rebate.onHoldUsdAmount)
  return fmtSignedAmount(Math.max(0, pending - hold), 'USD')
}

type SummaryPayoutEntry = {
  id: string
  payoutDate: Date
  amount: number
  title: string
  line1: string
  icon: RewardEventIconKind
  program: 'loyalty' | 'rebates'
}

function formatSummaryTradingDate(d: Date): string {
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

/** Понедельник календарной недели, следующей за неделей, в которую попадает `d`. */
function startOfNextCalendarWeekMonday(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  const dow = x.getDay()
  const daysToSunday = (7 - dow) % 7
  const mondayAfterThisWeekSunday = new Date(x)
  mondayAfterThisWeekSunday.setDate(x.getDate() + daysToSunday + 1)
  return mondayAfterThisWeekSunday
}

/** Середина следующей недели (ср) — одна дата для Loyalty в прототипе. */
function loyaltyPayoutMidNextWeek(d: Date): Date {
  const mon = startOfNextCalendarWeekMonday(d)
  const wed = new Date(mon)
  wed.setDate(mon.getDate() + 2)
  return wed
}

/**
 * Демо-строки для V4 summary drill: см. TRANSACTION_SUMMARY_DISPLAY_RULES.md
 * — USD: одна EXD cashback (завтра), long term каждый день +30…+60 дн. (без Loyalty rewards).
 * — EXD: одна Loyalty (ср следующей недели); те же long term; без EXD cashback.
 */
function buildSummaryPayoutEntries(
  currency: V2SummaryCurrencyPage,
  totalLabel: string,
  _pendingCount: number,
): SummaryPayoutEntry[] {
  const total = parseSignedAmount(totalLabel)
  if (total <= 0) return []

  const now = new Date()
  now.setHours(0, 0, 0, 0)

  const LONG_TERM_START_OFFSET = 30
  const LONG_TERM_END_OFFSET = 60
  const longTermDayCount = LONG_TERM_END_OFFSET - LONG_TERM_START_OFFSET + 1

  const entries: SummaryPayoutEntry[] = []
  const isUsd = currency === 'usd'

  const cashbackShare = isUsd ? 0.05 : 0
  const loyaltyShare = isUsd ? 0 : 0.05

  const round2 = (n: number) => Math.round(n * 100) / 100
  const cashbackAmt = round2(total * cashbackShare)
  const loyaltyAmt = round2(total * loyaltyShare)
  const longTermPool = Math.max(0, round2(total - cashbackAmt - loyaltyAmt))

  const baseDaily = Math.floor((longTermPool * 100) / longTermDayCount) / 100
  let allocated = 0

  const pushEntry = (partial: Omit<SummaryPayoutEntry, 'id'> & { idSuffix: string }) => {
    const { idSuffix, ...rest } = partial
    entries.push({ id: `${currency}-${idSuffix}`, ...rest })
  }

  if (isUsd && cashbackAmt > 0) {
    const payoutDate = new Date(now)
    payoutDate.setDate(now.getDate() + 1)
    pushEntry({
      idSuffix: 'exd-cashback',
      payoutDate,
      amount: cashbackAmt,
      title: 'EXD cashback',
      line1: 'For daily trading',
      icon: 'dollar',
      program: 'loyalty',
    })
  }

  if (!isUsd && loyaltyAmt > 0) {
    const payoutDate = loyaltyPayoutMidNextWeek(now)
    pushEntry({
      idSuffix: 'loyalty-rewards',
      payoutDate,
      amount: loyaltyAmt,
      title: 'Loyalty rewards',
      line1: 'For weekly trading',
      icon: 'crown',
      program: 'loyalty',
    })
  }

  for (let i = 0; i < longTermDayCount; i++) {
    const offset = LONG_TERM_START_OFFSET + i
    const payoutDate = new Date(now)
    payoutDate.setDate(now.getDate() + offset)

    let amount = baseDaily
    if (i === longTermDayCount - 1) {
      amount = round2(longTermPool - allocated)
    }
    amount = Math.max(0, amount)
    allocated += amount

    const tradeOn = new Date(payoutDate)
    tradeOn.setDate(tradeOn.getDate() - 60)

    pushEntry({
      idSuffix: `lt-${offset}`,
      payoutDate,
      amount,
      title: 'Long term rebates',
      line1: `For trading on ${formatSummaryTradingDate(tradeOn)}`,
      icon: isUsd ? 'dollar' : 'crown',
      program: 'rebates',
    })
  }

  return entries
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

function V2SummaryUpcomingBlock({
  usdAmount,
  exdAmount,
  onOpenUsd,
  onOpenExd,
}: {
  usdAmount: string
  exdAmount: string
  onOpenUsd: () => void
  onOpenExd: () => void
}) {
  const rows = [
    {
      id: 'summary-cashback',
      icon: 'dollar' as const,
      title: 'Cashback',
      amount: usdAmount,
      onOpen: onOpenUsd,
    },
    {
      id: 'summary-rewards',
      icon: 'crown' as const,
      title: 'Rewards',
      amount: exdAmount,
      onOpen: onOpenExd,
    },
  ]
  return (
    <div className={styles.v2SummaryList}>
      {rows.map((row) => (
        <button key={row.id} type="button" className={styles.v2SummaryCell} onClick={row.onOpen}>
          <span className={styles.v2SummaryCellIcon}>
            <RewardEventIcon kind={row.icon} />
          </span>
          <span className={styles.v2SummaryCellTitle}>{row.title}</span>
          <span className={styles.v2SummaryCellAmount}>{row.amount}</span>
          <IconChevronRight size={20} stroke={2} className={styles.v2SummaryCellChevron} aria-hidden />
        </button>
      ))}
    </div>
  )
}

type V2SummaryProgramFilter = 'all' | 'loyalty' | 'rebates'

function V2SummaryCurrencyDetailPage({
  currency,
  totalLabel,
  pendingCount,
  onBack,
}: {
  currency: V2SummaryCurrencyPage
  totalLabel: string
  pendingCount: number
  onBack: () => void
}) {
  const title = currency === 'usd' ? 'Upcoming cashback' : 'Upcoming rewards'
  const unit = currency.toUpperCase() as 'USD' | 'EXD'
  const [periodMode, setPeriodMode] = useState<'all-time' | 'month' | 'week'>('all-time')
  const [hoveredBucketId, setHoveredBucketId] = useState<string | null>(null)
  const [programFilter, setProgramFilter] = useState<V2SummaryProgramFilter>('all')
  const [programMenuOpen, setProgramMenuOpen] = useState(false)
  const [periodMenuOpen, setPeriodMenuOpen] = useState(false)
  const programDropdownRef = useRef<HTMLDivElement>(null)
  const periodDropdownRef = useRef<HTMLDivElement>(null)

  const allEntries = useMemo(
    () => buildSummaryPayoutEntries(currency, totalLabel, pendingCount),
    [currency, totalLabel, pendingCount],
  )
  const entries = useMemo(
    () =>
      programFilter === 'all'
        ? allEntries
        : allEntries.filter((e) => e.program === programFilter),
    [allEntries, programFilter],
  )

  useEffect(() => {
    if (!programMenuOpen && !periodMenuOpen) return
    const onDocDown = (e: MouseEvent) => {
      const t = e.target as Node
      if (programMenuOpen && programDropdownRef.current && !programDropdownRef.current.contains(t)) {
        setProgramMenuOpen(false)
      }
      if (periodMenuOpen && periodDropdownRef.current && !periodDropdownRef.current.contains(t)) {
        setPeriodMenuOpen(false)
      }
    }
    document.addEventListener('mousedown', onDocDown)
    return () => document.removeEventListener('mousedown', onDocDown)
  }, [programMenuOpen, periodMenuOpen])
  const monthOptions = useMemo(() => {
    const base = new Date()
    base.setDate(1)
    base.setHours(0, 0, 0, 0)
    return ([0, 1, 2] as const).map((offset) => {
      const m = new Date(base)
      m.setMonth(base.getMonth() + offset)
      return {
        offset,
        month: m.getMonth(),
        year: m.getFullYear(),
        label: m.toLocaleDateString('en-US', { month: 'short' }),
      }
    })
  }, [])

  const selectedMonth = monthOptions[0]

  const visibleEntries = useMemo(() => {
    const sorted = [...entries].sort((a, b) => a.payoutDate.getTime() - b.payoutDate.getTime())
    if (periodMode === 'all-time') {
      const start = new Date(monthOptions[0].year, monthOptions[0].month, 1)
      const end = new Date(monthOptions[0].year, monthOptions[0].month + 2, 0)
      return sorted.filter((entry) => entry.payoutDate >= start && entry.payoutDate <= end)
    }
    return sorted.filter(
      (entry) =>
        entry.payoutDate.getMonth() === selectedMonth.month &&
        entry.payoutDate.getFullYear() === selectedMonth.year,
    )
  }, [entries, monthOptions, periodMode, selectedMonth.month, selectedMonth.year])

  const viewTotal = useMemo(
    () => visibleEntries.reduce((sum, entry) => sum + entry.amount, 0),
    [visibleEntries],
  )

  const chartBuckets = useMemo(() => {
    if (periodMode === 'week') {
      const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
      const weekdayTotals = new Array(7).fill(0) as number[]
      visibleEntries.forEach((entry) => {
        const jsDay = entry.payoutDate.getDay()
        const mondayFirst = jsDay === 0 ? 6 : jsDay - 1
        weekdayTotals[mondayFirst] += entry.amount
      })
      return labels.map((label, idx) => ({
        id: `wkday-${idx}`,
        label,
        total: weekdayTotals[idx],
        tooltipLabel: `${selectedMonth.label} · ${label}`,
      }))
    }

    if (periodMode === 'month') {
      const monthName = selectedMonth.label
      const monthDays = new Date(selectedMonth.year, selectedMonth.month + 1, 0).getDate()
      const ranges = [
        { start: 1, end: 7 },
        { start: 8, end: 14 },
        { start: 15, end: 22 },
        { start: 23, end: monthDays },
      ]
      return ranges
        .filter((range) => range.start <= monthDays)
        .map((range, idx) => {
          const total = visibleEntries
            .filter((entry) => {
              const day = entry.payoutDate.getDate()
              return day >= range.start && day <= range.end
            })
            .reduce((sum, entry) => sum + entry.amount, 0)
          return {
            id: `month-${idx}`,
            label: `${monthName} ${range.start}-${range.end}`,
            total,
            tooltipLabel: `${monthName} ${range.start}-${range.end}`,
          }
        })
    }

    const baseMonth = monthOptions[0]
    return Array.from({ length: 4 }, (_, idx) => {
      const monthShift = Math.floor(idx / 2)
      const firstHalf = idx % 2 === 0
      const d = new Date(baseMonth.year, baseMonth.month, 1)
      d.setMonth(d.getMonth() + monthShift)
      const y = d.getFullYear()
      const m = d.getMonth()
      const monthDays = new Date(y, m + 1, 0).getDate()
      const start = firstHalf ? 1 : 15
      const end = firstHalf ? Math.min(14, monthDays) : monthDays
      const monthName = d.toLocaleDateString('en-US', { month: 'short' })
      const total = visibleEntries
        .filter((entry) => {
          return (
            entry.payoutDate.getFullYear() === y &&
            entry.payoutDate.getMonth() === m &&
            entry.payoutDate.getDate() >= start &&
            entry.payoutDate.getDate() <= end
          )
        })
        .reduce((sum, entry) => sum + entry.amount, 0)
      return {
        id: `all-${idx}`,
        label: `${monthName} ${start}-${end}`,
        total,
        tooltipLabel: `${monthName} ${start}-${end}`,
      }
    })
  }, [monthOptions, periodMode, selectedMonth.label, selectedMonth.month, selectedMonth.year, visibleEntries])

  const maxBar = chartBuckets.reduce((m, b) => Math.max(m, b.total), 0)
  const axisMax = Math.max(5, Math.ceil(maxBar))
  const axisTicks = [5, 4, 3, 2, 1, 0].map((n) => ((axisMax * n) / 5).toFixed(2))

  const groupedRows = useMemo(() => {
    const today = new Date()
    today.setHours(0, 0, 0, 0)
    const groups = new Map<string, V2UpcomingRowData[]>()
    visibleEntries.forEach((entry, idx) => {
      const key =
        entry.payoutDate.getTime() - today.getTime() <= 24 * 60 * 60 * 1000
          ? 'Tomorrow'
          : entry.payoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const row: V2UpcomingRowData = {
        id: `${entry.id}-${periodMode}-${idx}`,
        icon: entry.icon,
        title: entry.title,
        amount: fmtSignedAmount(entry.amount, unit),
        line1: entry.line1,
        date: '',
      }
      const arr = groups.get(key)
      if (arr) arr.push(row)
      else groups.set(key, [row])
    })
    return Array.from(groups.entries()).map(([heading, rows], idx) => ({
      id: `summary-detail-${idx}`,
      heading,
      rows,
    }))
  }, [visibleEntries, periodMode, currency, unit])

  const programChipLabel =
    programFilter === 'all'
      ? 'All programs'
      : programFilter === 'loyalty'
        ? 'Loyalty'
        : 'Long term rebates'
  const periodChipLabel =
    periodMode === 'all-time' ? 'All time' : periodMode === 'month' ? 'Month' : 'Week'

  return (
    <div className={styles.v2SummaryDetailPage}>
      <div className={styles.v2SummaryDetailTop}>
        <button type="button" className={styles.v2InnerBack} onClick={onBack} aria-label="Back">
          <IconChevronLeft size={22} stroke={2} aria-hidden />
        </button>
        <p className={styles.v2SummaryDetailNavTitle}>{title}</p>
      </div>

      <div className={styles.v2SummaryDetailHero}>
        <p className={styles.v2SummaryDetailLabel}>{title}</p>
        <p className={styles.v2SummaryDetailAmount}>
          {unsignedAmountLabel(fmtSignedAmount(viewTotal, unit as 'USD' | 'EXD'))}
        </p>
      </div>

      <div className={styles.v2SummaryFilterRow}>
        <div className={styles.v2SummaryDropdown} ref={programDropdownRef}>
          <button
            type="button"
            className={`${styles.v2SummaryFilterChip} ${programFilter !== 'all' ? styles.v2SummaryFilterChipActive : ''}`}
            aria-expanded={programMenuOpen}
            aria-haspopup="listbox"
            aria-label="Program"
            onClick={() => {
              setProgramMenuOpen((o) => !o)
              setPeriodMenuOpen(false)
            }}
          >
            {programChipLabel}
            <IconChevronDown size={16} stroke={2} aria-hidden />
          </button>
          {programMenuOpen ? (
            <div className={styles.v2SummaryDropdownMenu} role="listbox" aria-label="Program">
              <button
                type="button"
                className={styles.v2SummaryDropdownItem}
                role="option"
                aria-selected={programFilter === 'all'}
                onClick={() => {
                  setProgramFilter('all')
                  setProgramMenuOpen(false)
                }}
              >
                All programs
              </button>
              <button
                type="button"
                className={styles.v2SummaryDropdownItem}
                role="option"
                aria-selected={programFilter === 'loyalty'}
                onClick={() => {
                  setProgramFilter('loyalty')
                  setProgramMenuOpen(false)
                }}
              >
                Loyalty
              </button>
              <button
                type="button"
                className={styles.v2SummaryDropdownItem}
                role="option"
                aria-selected={programFilter === 'rebates'}
                onClick={() => {
                  setProgramFilter('rebates')
                  setProgramMenuOpen(false)
                }}
              >
                Long term rebates
              </button>
            </div>
          ) : null}
        </div>

        <div className={styles.v2SummaryDropdown} ref={periodDropdownRef}>
          <button
            type="button"
            className={`${styles.v2SummaryFilterChip} ${periodMode !== 'all-time' ? styles.v2SummaryFilterChipActive : ''}`}
            aria-expanded={periodMenuOpen}
            aria-haspopup="listbox"
            aria-label="Period"
            onClick={() => {
              setPeriodMenuOpen((o) => !o)
              setProgramMenuOpen(false)
            }}
          >
            {periodChipLabel}
            <IconChevronDown size={16} stroke={2} aria-hidden />
          </button>
          {periodMenuOpen ? (
            <div className={styles.v2SummaryDropdownMenu} role="listbox" aria-label="Period">
              {(
                [
                  { id: 'all-time' as const, label: 'All time' },
                  { id: 'month' as const, label: 'Month' },
                  { id: 'week' as const, label: 'Week' },
                ] as const
              ).map((opt) => (
                <button
                  key={opt.id}
                  type="button"
                  className={styles.v2SummaryDropdownItem}
                  role="option"
                  aria-selected={periodMode === opt.id}
                  onClick={() => {
                    setPeriodMode(opt.id)
                    setPeriodMenuOpen(false)
                  }}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <div className={styles.v2SummaryChart}>
        <div className={styles.v2SummaryChartHeader}>{unit}</div>
        <div className={styles.v2SummaryChartBody}>
          <div className={styles.v2SummaryAxis}>
            {axisTicks.map((t, i) => (
              <p key={`${t}-${i}`}>{i === axisTicks.length - 1 ? '0' : t}</p>
            ))}
          </div>
          <div className={styles.v2SummaryBarsPlotWrap}>
            <div className={styles.v2SummaryBars}>
              {chartBuckets.map((b) => {
                const h =
                  maxBar > 0 && b.total > 0 ? Math.round((b.total / maxBar) * 184) : 0
                return (
                  <button
                    key={b.id}
                    type="button"
                    className={styles.v2SummaryBarCol}
                    aria-label={b.label}
                    onMouseEnter={() => setHoveredBucketId(b.id)}
                    onMouseLeave={() => setHoveredBucketId((prev) => (prev === b.id ? null : prev))}
                    onFocus={() => setHoveredBucketId(b.id)}
                    onBlur={() => setHoveredBucketId((prev) => (prev === b.id ? null : prev))}
                  >
                    {hoveredBucketId === b.id ? (
                      <span
                        className={styles.v2SummaryBarTooltip}
                        style={{ bottom: h > 0 ? h : 8 }}
                      >
                        <strong>{fmtSignedAmount(b.total, unit)}</strong>
                        <span>{b.tooltipLabel}</span>
                      </span>
                    ) : null}
                    {h > 0 ? <span className={styles.v2SummaryBar} style={{ height: `${h}px` }} /> : null}
                  </button>
                )
              })}
            </div>
            <div className={styles.v2SummaryChartTicksRow} aria-hidden>
              {chartBuckets.map((b) => (
                <div key={`tick-${b.id}`} className={styles.v2SummaryTickCell}>
                  {b.label}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {groupedRows.map((group) =>
        group.rows.length > 0 ? (
          <div key={group.id} className={styles.v2SummaryDetailGroup}>
            <p className={styles.v2DateHeading}>{group.heading}</p>
            {group.rows.map((row) => (
              <V2UpcomingRow key={row.id} row={row} />
            ))}
          </div>
        ) : null,
      )}
      {groupedRows.length === 0 ? (
        <p className={styles.emptyHint}>No payouts in this selection</p>
      ) : null}
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
  icon: RewardEventIconKind
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
        <RewardEventIcon kind={row.icon} />
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

type ExnessRewardsScreenProps = {
  /** Сброс локального UI при смене сценария симулятора. */
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
  const [v2SummaryCurrencyPage, setV2SummaryCurrencyPage] = useState<V2SummaryCurrencyPage | null>(
    null,
  )
  const availableExdAmount = parseWalletExdBalance(availableRewardsExd)
  const canTransferToAccount =
    Number.isFinite(availableExdAmount) && availableExdAmount > 0

  const upcomingLoyaltyExd = useMemo(
    () =>
      upcomingItems
        .filter((row) => row.icon === 'crown')
        .reduce((sum, row) => sum + Math.max(0, parseExdAmount(row.amount)), 0),
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

  const v4SummaryUsdLabel = useMemo(
    () => unsignedAmountLabel(rebatePendingUsdExcludingHold(rebateDemo)),
    [rebateDemo],
  )

  useEffect(() => {
    setV2SummaryCurrencyPage(null)
  }, [rebateScenarioId])

  useEffect(() => {
    scrollDeviceFrameToTop()
  }, [v2SummaryCurrencyPage])

  if (v2SummaryCurrencyPage) {
    return (
      <div className={`${styles.screen} ${styles.screenDrillOnly}`} data-node-id="42104:10683">
        <DrillScreenStatusBar />
        <div className={styles.flexDrillPageRoot}>
          <V2SummaryCurrencyDetailPage
            currency={v2SummaryCurrencyPage}
            totalLabel={
              v2SummaryCurrencyPage === 'usd'
                ? rebatePendingUsdExcludingHold(rebateDemo)
                : rebateDemo.pendingExd
            }
            pendingCount={rebateDemo.pendingCount}
            onBack={() => setV2SummaryCurrencyPage(null)}
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
            <p className={styles.bannerTitle}>Long-term rebates</p>
            <p className={styles.bannerDesc}>Trade and get rebates after 60 day.</p>
          </div>
          <div className={styles.bannerArt} aria-hidden>
            💸
          </div>
        </div>

        <div className={styles.sectionSpacer} aria-hidden />
        <SectionTitle title="Upcoming" showChevron={false} />
        <V2SummaryUpcomingBlock
          usdAmount={v4SummaryUsdLabel}
          exdAmount={unsignedAmountLabel(rebateDemo.pendingExd)}
          onOpenUsd={() => setV2SummaryCurrencyPage('usd')}
          onOpenExd={() => setV2SummaryCurrencyPage('exd')}
        />

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
              icon={<RewardEventIcon kind={row.icon} />}
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
