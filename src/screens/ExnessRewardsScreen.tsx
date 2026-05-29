import { useEffect, useMemo, useState, type ReactNode } from 'react'
import {
  IconArrowRight,
  IconArrowsRightLeft,
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
import { parseUpcomingPayoutDate, parseDemoToday } from '../rewardLifecycle/demoTimeline'
import { parseSignedAmount } from '../rewardLifecycle/rebateSimulatorSteps'
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

/** Upcoming USD: сумма строк cashback (icon dollar) из lifecycle. */
function upcomingUsdSum(items: LifecycleUpcomingItem[]): number {
  return items
    .filter((row) => row.icon === 'dollar')
    .reduce((acc, row) => acc + Math.max(0, parseSignedAmount(row.amount)), 0)
}

function upcomingUsdTotal(items: LifecycleUpcomingItem[]): string {
  return fmtSignedAmount(upcomingUsdSum(items), 'USD')
}

/** Upcoming EXD: сумма строк loyalty (icon crown) из lifecycle. */
function upcomingExdSum(items: LifecycleUpcomingItem[]): number {
  return items
    .filter((row) => row.icon === 'crown')
    .reduce((acc, row) => acc + Math.max(0, parseExdAmount(row.amount)), 0)
}

function upcomingExdTotal(items: LifecycleUpcomingItem[]): string {
  return fmtSignedAmount(upcomingExdSum(items), 'EXD')
}

type SummaryPayoutEntry = {
  id: string
  payoutDate: Date
  amount: number
  title: string
  line1: string
  icon: RewardEventIconKind
  countBadge?: string
}

/** Drill-in Upcoming: строки из lifecycle `upcoming[]`, без синтеза. */
function buildDrillEntriesFromUpcoming(
  items: LifecycleUpcomingItem[],
  currency: V2SummaryCurrencyPage,
  demoTodayIso: string,
): SummaryPayoutEntry[] {
  const iconFilter = currency === 'usd' ? 'dollar' : 'crown'

  return items
    .filter((item) => item.icon === iconFilter)
    .map((item) => {
      const payoutDate =
        parseUpcomingPayoutDate(item.date) ?? parseDemoToday(demoTodayIso)
      const amount =
        currency === 'usd'
          ? Math.max(0, parseSignedAmount(item.amount))
          : Math.max(0, parseExdAmount(item.amount))

      return {
        id: item.id,
        payoutDate,
        amount,
        title: item.title,
        line1: item.lines[0] ?? '',
        icon: item.icon,
        countBadge: item.badge,
      }
    })
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
  showUsd,
  showExd,
  usdAmount,
  exdAmount,
  onOpenUsd,
  onOpenExd,
}: {
  showUsd: boolean
  showExd: boolean
  usdAmount: string
  exdAmount: string
  onOpenUsd: () => void
  onOpenExd: () => void
}) {
  const rows = [
    showUsd
      ? {
          id: 'summary-cashback',
          icon: 'dollar' as const,
          title: 'EXD cashback',
          amount: usdAmount,
          onOpen: onOpenUsd,
        }
      : null,
    showExd
      ? {
          id: 'summary-rewards',
          icon: 'crown' as const,
          title: 'Rewards',
          amount: exdAmount,
          onOpen: onOpenExd,
        }
      : null,
  ].filter((row): row is NonNullable<typeof row> => row !== null)
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

function V2SummaryCurrencyDetailPage({
  currency,
  upcomingItems,
  demoTodayIso,
  onBack,
}: {
  currency: V2SummaryCurrencyPage
  upcomingItems: LifecycleUpcomingItem[]
  demoTodayIso: string
  onBack: () => void
}) {
  const title = currency === 'usd' ? 'Upcoming cashback' : 'Upcoming rewards'
  const unit = currency.toUpperCase() as 'USD' | 'EXD'

  const entries = useMemo(
    () =>
      [...buildDrillEntriesFromUpcoming(upcomingItems, currency, demoTodayIso)].sort(
        (a, b) => a.payoutDate.getTime() - b.payoutDate.getTime(),
      ),
    [upcomingItems, currency, demoTodayIso],
  )

  const viewTotal = useMemo(
    () => entries.reduce((sum, entry) => sum + entry.amount, 0),
    [entries],
  )

  const groupedRows = useMemo(() => {
    const today = parseDemoToday(demoTodayIso)
    const tomorrow = new Date(today)
    tomorrow.setDate(today.getDate() + 1)
    const groups = new Map<string, V2UpcomingRowData[]>()
    entries.forEach((entry, idx) => {
      const isTomorrow = entry.payoutDate.getTime() === tomorrow.getTime()
      const key = isTomorrow
        ? 'Tomorrow'
        : entry.payoutDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
      const row: V2UpcomingRowData = {
        id: `${entry.id}-${idx}`,
        icon: entry.icon,
        title: entry.title,
        amount: fmtSignedAmount(entry.amount, unit),
        line1: entry.line1,
        date: '',
        countBadge: entry.countBadge,
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
  }, [entries, unit, demoTodayIso])

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
        <p className={styles.emptyHint}>No upcoming payouts</p>
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
  /** Сброс локального UI при смене шага симулятора. */
  simulatorStepId: string
  /** `category: 'cashback'` — с Lifetime cashback; без opts — с Activity feed */
  onOpenActivityFeed?: (opts?: { category?: ActivityTypeFilter }) => void
  onOpenRewardModal?: (variant: RewardModalVariant, feedItemId?: string) => void
  availableRewardsExd: string
  tradingWalletLabel: string
  tradingWalletValue: string
  tradingWalletMuted: boolean
  lifetimeCashbackUsd: string
  /** Накопительный заработанный EXD для тира (не падает при списании EXD на rebate). */
  tierEarnedExdTowardGoal: number
  /** Дата «сегодня» текущего шага симулятора (YYYY-MM-DD). */
  demoTodayIso: string
  upcomingItems: LifecycleUpcomingItem[]
  activityPreviewItems: LifecycleActivityPreviewItem[]
}

export function ExnessRewardsScreen({
  simulatorStepId,
  onOpenActivityFeed,
  onOpenRewardModal,
  availableRewardsExd,
  tradingWalletLabel,
  tradingWalletValue,
  tradingWalletMuted,
  lifetimeCashbackUsd,
  tierEarnedExdTowardGoal,
  demoTodayIso,
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

  const upcomingUsd = useMemo(() => upcomingUsdSum(upcomingItems), [upcomingItems])
  const upcomingExd = useMemo(() => upcomingExdSum(upcomingItems), [upcomingItems])
  const showUpcomingUsd = upcomingUsd > 0
  const showUpcomingExd = upcomingExd > 0
  const showUpcomingSection = showUpcomingUsd || showUpcomingExd

  const v4SummaryUsdLabel = useMemo(
    () => unsignedAmountLabel(upcomingUsdTotal(upcomingItems)),
    [upcomingItems],
  )

  const v4SummaryExdLabel = useMemo(
    () => unsignedAmountLabel(upcomingExdTotal(upcomingItems)),
    [upcomingItems],
  )

  useEffect(() => {
    setV2SummaryCurrencyPage(null)
  }, [simulatorStepId])

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
            upcomingItems={upcomingItems}
            demoTodayIso={demoTodayIso}
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
        {showUpcomingSection ? (
          <>
            <SectionTitle title="Upcoming" showChevron={false} />
            <V2SummaryUpcomingBlock
              showUsd={showUpcomingUsd}
              showExd={showUpcomingExd}
              usdAmount={v4SummaryUsdLabel}
              exdAmount={v4SummaryExdLabel}
              onOpenUsd={() => setV2SummaryCurrencyPage('usd')}
              onOpenExd={() => setV2SummaryCurrencyPage('exd')}
            />
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
