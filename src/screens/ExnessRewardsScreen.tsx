import { useEffect, useMemo, useState, type ReactNode } from 'react'
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
import styles from './ExnessRewardsScreen.module.css'

/** Временно скрываем бейдж в разметке (элемент в DOM остаётся). Поставь false, чтобы снова показать. */
const HIDE_TRANSACTION_BADGES = true

const TIER_EXD_GOAL = 1000
type SpreadPrototypeVariant = 'v1' | 'v2' | 'v3' | 'v4'

const SPREAD_DEMO = {
  pendingCount: 60,
  pendingExd: '+184.20 EXD',
  pendingUsd: '+192.45 USD',
  nextPayoutDate: '7 May 2026',
  paidExdCount: 5,
  paidExdAmount: '+20.98 EXD',
  onHoldUsdCount: 5,
  onHoldUsdAmount: '+21.40 USD',
  totalWithOnHoldUsd: '+213.85 USD',
}

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
  date: string
  pinned?: boolean
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

function V2UpcomingRow({ row }: { row: V2UpcomingRowData }) {
  return (
    <div className={`${styles.v2Row} ${row.pinned ? styles.v2RowPinned : ''}`}>
      <div className={styles.v2RowIcon}>
        <RowIconTabler kind={row.icon} />
      </div>
      <div className={styles.v2RowBody}>
        <div className={styles.v2RowHead}>
          <p className={styles.v2RowTitle}>
            {row.title}
            {row.pinned ? <span className={styles.v2PinTag}>Pinned</span> : null}
          </p>
          <p className={styles.v2RowAmount}>{row.amount}</p>
        </div>
        <div className={styles.v2RowDesc}>
          <div className={styles.v2RowText}>
            <p>{row.line1}</p>
            {row.line2 ? <p>{row.line2}</p> : null}
          </div>
          <p className={styles.v2RowDate}>{row.date}</p>
        </div>
      </div>
    </div>
  )
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
  upcomingItems: LifecycleUpcomingItem[]
  activityPreviewItems: LifecycleActivityPreviewItem[]
}

export function ExnessRewardsScreen({
  spreadVariant,
  onOpenActivityFeed,
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
  const [v2FullUpcomingOpen, setV2FullUpcomingOpen] = useState(false)
  const [v4AccountSelected, setV4AccountSelected] = useState(false)
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

  const v1NextUsdPayout = `+${(192.45 / 60).toFixed(2)} USD`
  const v1NextExdPayout = `+${(184.2 / 60).toFixed(2)} EXD`

  useEffect(() => {
    if (spreadVariant !== 'v2') setV2FullUpcomingOpen(false)
  }, [spreadVariant])

  const v1UpcomingRows: LifecycleUpcomingItem[] = useMemo(
    () => [
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
      {
        id: 'v1-cash-rebates',
        icon: 'dollar',
        title: 'Cash rebates',
        amount: SPREAD_DEMO.pendingUsd,
        lines: [
          `${SPREAD_DEMO.pendingCount} pending payouts`,
          `Next ${v1NextUsdPayout} on ${SPREAD_DEMO.nextPayoutDate}`,
        ],
        date: 'In queue',
        rewardModal: 'cashback-upcoming',
      },
      {
        id: 'v1-reward-rebates',
        icon: 'crown',
        title: 'Reward rebates',
        amount: SPREAD_DEMO.pendingExd,
        lines: [
          `${SPREAD_DEMO.pendingCount} pending payouts`,
          `Next ${v1NextExdPayout} on ${SPREAD_DEMO.nextPayoutDate}`,
        ],
        date: 'In queue',
        rewardModal: 'loyalty-upcoming',
      },
    ],
    [],
  )

  const showUpcomingBlock =
    spreadVariant !== 'v2' &&
    (spreadVariant === 'v1' || upcomingItems.length > 0)

  const flexiblePreviewRows: V2UpcomingRowData[] = [
    {
      id: 'pin-cashback',
      icon: 'dollar',
      title: 'Cashback',
      amount: '+0.64 USD',
      line1: 'For daily trading',
      date: 'Tomorrow',
      pinned: true,
    },
    {
      id: 'pin-loyalty',
      icon: 'crown',
      title: 'Loyalty rewards',
      amount: '+3.70 EXD',
      line1: 'For weekly trading',
      date: 'on Jan 17',
      pinned: true,
    },
    {
      id: 'pin-spread-exd',
      icon: 'dollar',
      title: 'Spread rebates',
      amount: '+2.45 USD',
      line1: 'Closest payout',
      line2: 'Place for text',
      date: 'Place for date',
    },
    {
      id: 'pin-spread-usd',
      icon: 'crown',
      title: 'Spread rebates',
      amount: '+1.20 EXD',
      line1: 'Closest payout',
      line2: 'Place for text',
      date: 'Place for date',
    },
  ]

  const flexibleAllRows: V2UpcomingRowData[] = [
    ...flexiblePreviewRows,
    {
      id: 'all-loyalty-next',
      icon: 'crown',
      title: 'Loyalty rewards',
      amount: '+2.20 EXD',
      line1: 'For weekly trading',
      date: 'on Jan 24',
    },
    {
      id: 'all-cashback-next',
      icon: 'dollar',
      title: 'Cashback',
      amount: '+4.10 USD',
      line1: 'For daily trading',
      date: 'on Jan 25',
    },
    {
      id: 'all-spread-agg',
      icon: 'dollar',
      title: 'Spread rebate · all pending',
      amount: `${SPREAD_DEMO.pendingExd} / ${SPREAD_DEMO.pendingUsd}`,
      line1: `${SPREAD_DEMO.pendingCount} payouts pending in total`,
      date: 'Daily',
    },
    {
      id: 'all-spread-paid',
      icon: 'crown',
      title: 'Spread rebate · EXD already paid',
      amount: SPREAD_DEMO.paidExdAmount,
      line1: `${SPREAD_DEMO.paidExdCount} mature payouts processed`,
      date: 'Done',
    },
  ]

  const v4UpcomingRows: V2UpcomingRowData[] = [
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
    {
      id: 'v4-spread-usd',
      icon: 'dollar',
      title: 'Spread rebates',
      amount: '+2.45 USD',
      line1: 'Closest payout',
      line2: 'Place for text',
      date: 'Place for date',
    },
    {
      id: 'v4-spread-exd',
      icon: 'crown',
      title: 'Spread rebates',
      amount: '+1.20 EXD',
      line1: 'Closest payout',
      line2: 'Place for text',
      date: 'Place for date',
    },
  ]

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
            <p className={styles.bannerTitle}>Get 1% back from every trade</p>
            <p className={styles.bannerDesc}>
              Get 1% in USD and 1% in EXD from daily spread. Payout arrives in 60 days.
            </p>
          </div>
          <div className={styles.bannerArt} aria-hidden>
            💸
          </div>
        </div>

        {spreadVariant === 'v2' && v2FullUpcomingOpen ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <div className={styles.v2InnerHeader}>
              <button
                type="button"
                className={styles.v2InnerBack}
                onClick={() => setV2FullUpcomingOpen(false)}
                aria-label="Back"
              >
                <IconChevronLeft size={22} stroke={2} aria-hidden />
              </button>
              <p className={styles.v2InnerTitle}>Upcoming</p>
            </div>
            <div className={styles.v2AllPage}>
              <p className={styles.v2PinnedHeader}>All upcoming</p>
              {flexibleAllRows.map((row) => (
                <V2UpcomingRow key={row.id} row={row} />
              ))}
            </div>
          </>
        ) : null}

        {spreadVariant === 'v2' && !v2FullUpcomingOpen ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle
              title="Upcoming"
              showChevron
              onClick={() => setV2FullUpcomingOpen(true)}
            />
            <div className={styles.v2List}>
              <p className={styles.v2PinnedHeader}>Pinned</p>
              {flexiblePreviewRows.map((row, i) => (
                <div key={row.id}>
                  <V2UpcomingRow row={row} />
                  {i === 2 ? (
                    <div className={styles.v2Alert}>
                      <div className={styles.v2AlertIcon}>
                        <IconAlertTriangle size={20} stroke={2} aria-hidden />
                      </div>
                      <div className={styles.v2AlertBody}>
                        <p className={styles.v2AlertTitle}>Select account for USD</p>
                        <p className={styles.v2AlertDesc}>
                          {SPREAD_DEMO.onHoldUsdAmount} is waiting until account is selected.
                        </p>
                        <button type="button" className={styles.v2AlertBtn}>
                          Select account
                        </button>
                      </div>
                      <button type="button" className={styles.v2AlertClose} aria-label="Dismiss">
                        <IconX size={18} stroke={2} aria-hidden />
                      </button>
                    </div>
                  ) : null}
                </div>
              ))}
            </div>
          </>
        ) : null}

        {showUpcomingBlock ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle title="Upcoming" showChevron={spreadVariant === 'v1'} />
            {(spreadVariant === 'v1' ? v1UpcomingRows : upcomingItems).map((row) => (
              <TransactionRow
                key={row.id}
                icon={<RowIconTabler kind={row.icon} />}
                title={row.title}
                amount={row.amount}
                lines={row.lines}
                date={row.date}
                badge={row.badge}
                onOpenDetail={
                  onOpenRewardModal ? () => onOpenRewardModal(row.rewardModal) : undefined
                }
              />
            ))}
          </>
        ) : null}

        {spreadVariant === 'v3' ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle title="Spread rebate" showChevron={false} />
            <div className={styles.spreadWidget}>
              <div className={styles.spreadWidgetHead}>
                <p className={styles.spreadWidgetMeta}>60-day payout pipeline</p>
                <p className={styles.spreadWidgetNext}>Next: {SPREAD_DEMO.nextPayoutDate}</p>
              </div>
              <div className={styles.spreadWidgetTotals}>
                <div>
                  <p className={styles.spreadWidgetLabel}>Upcoming EXD</p>
                  <p className={styles.spreadWidgetValue}>{SPREAD_DEMO.pendingExd}</p>
                </div>
                <div>
                  <p className={styles.spreadWidgetLabel}>Upcoming USD</p>
                  <p className={styles.spreadWidgetValue}>{SPREAD_DEMO.pendingUsd}</p>
                </div>
              </div>
              <p className={styles.spreadWidgetHint}>
                {SPREAD_DEMO.pendingCount} payouts pending in total
              </p>
              <div className={styles.spreadWidgetWarn}>
                <p className={styles.spreadWidgetWarnTitle}>USD account is not selected</p>
                <p className={styles.spreadWidgetWarnHint}>
                  {SPREAD_DEMO.onHoldUsdAmount} from {SPREAD_DEMO.onHoldUsdCount} mature payouts is on
                  hold. EXD already credited: {SPREAD_DEMO.paidExdAmount}.
                </p>
              </div>
              <div className={styles.spreadWidgetFooter}>
                <button type="button" className={styles.spreadWidgetCta}>
                  Select USD account
                </button>
                <p className={styles.spreadWidgetTotalUsd}>
                  Total future USD incl. on-hold: {SPREAD_DEMO.totalWithOnHoldUsd}
                </p>
              </div>
            </div>
          </>
        ) : null}

        {spreadVariant === 'v4' ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle title="Spread rebates" showChevron />
            <div className={styles.v4Section}>
              <div className={styles.v4StateSwitch} role="group" aria-label="USD destination state">
                <button
                  type="button"
                  className={`${styles.v4StateBtn} ${!v4AccountSelected ? styles.v4StateBtnActive : ''}`}
                  onClick={() => setV4AccountSelected(false)}
                >
                  Account not selected
                </button>
                <button
                  type="button"
                  className={`${styles.v4StateBtn} ${v4AccountSelected ? styles.v4StateBtnActive : ''}`}
                  onClick={() => setV4AccountSelected(true)}
                >
                  Account selected
                </button>
              </div>

              {!v4AccountSelected ? (
                <div className={styles.v4Alert}>
                  <div className={styles.v4AlertIcon}>
                    <IconAlertTriangle size={20} stroke={2} aria-hidden />
                  </div>
                  <div className={styles.v4AlertBody}>
                    <p className={styles.v4AlertTitle}>Select account for USD</p>
                    <p className={styles.v4AlertDesc}>
                      {SPREAD_DEMO.onHoldUsdAmount} is waiting for account selection.
                    </p>
                    <button type="button" className={styles.v4AlertBtn}>
                      Select account
                    </button>
                  </div>
                </div>
              ) : (
                <div className={styles.v4AccountInfo}>
                  <p className={styles.v4AccountLabel}>USD destination account</p>
                  <p className={styles.v4AccountValue}>MT5 · #12345678</p>
                </div>
              )}
              <div className={styles.v4Summary}>
                <div className={styles.v4SummaryTop}>
                  <div>
                    <p className={styles.v4SummaryLabel}>Accumulated USD</p>
                    <p className={styles.v4SummaryValue}>{SPREAD_DEMO.pendingUsd}</p>
                  </div>
                  <div>
                    <p className={styles.v4SummaryLabel}>Accumulated EXD</p>
                    <p className={styles.v4SummaryValue}>{SPREAD_DEMO.pendingExd}</p>
                  </div>
                </div>
                <p className={styles.v4SummaryInfo}>
                  {SPREAD_DEMO.pendingCount} future payouts, nearest on {SPREAD_DEMO.nextPayoutDate}
                </p>
              </div>
            </div>

            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle title="Upcoming" showChevron />
            <div className={styles.v4UpcomingList}>
              {v4UpcomingRows.map((row) => (
                <V2UpcomingRow key={row.id} row={row} />
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
