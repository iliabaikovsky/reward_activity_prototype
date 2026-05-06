import { useMemo, useState, type ReactNode } from 'react'
import {
  IconArrowRight,
  IconArrowsRightLeft,
  IconChevronLeft,
  IconChevronRight,
  IconCrown,
  IconCrownOff,
  IconCurrencyDollar,
  IconGift,
  IconInfoCircle,
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
type SpreadPrototypeVariant = 'v1' | 'v2' | 'v3'

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
  const [spreadVariant, setSpreadVariant] = useState<SpreadPrototypeVariant>('v1')
  const [showFlexibleUpcomingAll, setShowFlexibleUpcomingAll] = useState(false)
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

  const spreadRowsV1: LifecycleUpcomingItem[] = useMemo(
    () => [
      {
        id: 'spread-v1-exd',
        icon: 'crown',
        title: 'Spread rebate · EXD upcoming',
        amount: SPREAD_DEMO.pendingExd,
        lines: [
          `${SPREAD_DEMO.pendingCount} payouts pending`,
          `Next payout: ${SPREAD_DEMO.nextPayoutDate}`,
          `${SPREAD_DEMO.paidExdCount} payouts already credited in EXD`,
        ],
        date: 'Daily',
        rewardModal: 'loyalty-upcoming',
      },
      {
        id: 'spread-v1-usd',
        icon: 'dollar',
        title: 'Spread rebate · USD upcoming',
        amount: SPREAD_DEMO.pendingUsd,
        lines: [
          `${SPREAD_DEMO.pendingCount} payouts pending`,
          `Next payout: ${SPREAD_DEMO.nextPayoutDate}`,
          `${SPREAD_DEMO.onHoldUsdCount} payouts on hold — select account`,
        ],
        date: 'Daily',
        rewardModal: 'cashback-upcoming',
      },
    ],
    [],
  )

  const showUpcomingBlock = spreadVariant !== 'v2' && (upcomingItems.length > 0 || spreadVariant === 'v1')

  const flexiblePinnedRows = [
    { id: 'pin-loyalty', title: 'Weekly loyalty', amount: '+4.20 EXD', hint: 'Loyalty program' },
    { id: 'pin-cashback', title: 'Weekly cashback', amount: '+5.00 USD', hint: 'Cashback program' },
    {
      id: 'pin-spread-exd',
      title: 'Spread rebate · next EXD payout',
      amount: '+3.90 EXD',
      hint: `Next: ${SPREAD_DEMO.nextPayoutDate}`,
    },
    {
      id: 'pin-spread-usd',
      title: 'Spread rebate · USD on hold',
      amount: SPREAD_DEMO.onHoldUsdAmount,
      hint: 'Select account to release',
      warn: true,
    },
  ]

  const flexibleAllRows = [
    ...flexiblePinnedRows,
    {
      id: 'all-spread-agg',
      title: 'Spread rebate · all pending',
      amount: `${SPREAD_DEMO.pendingExd} / ${SPREAD_DEMO.pendingUsd}`,
      hint: `${SPREAD_DEMO.pendingCount} payouts pending in total`,
    },
    {
      id: 'all-spread-paid',
      title: 'Spread rebate · EXD already paid',
      amount: SPREAD_DEMO.paidExdAmount,
      hint: `${SPREAD_DEMO.paidExdCount} mature payouts processed`,
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
        <section className={styles.protoControls} aria-label="Spread rebate variant switcher">
          <div>
            <p className={styles.protoTitle}>Spread rebate prototypes</p>
            <p className={styles.protoSubtitle}>
              Same demo state: 60 pending payouts, EXD credited, USD on hold
            </p>
          </div>
          <div className={styles.protoToggle}>
            <button
              type="button"
              className={`${styles.protoToggleBtn} ${spreadVariant === 'v1' ? styles.protoToggleBtnActive : ''}`}
              onClick={() => {
                setSpreadVariant('v1')
                setShowFlexibleUpcomingAll(false)
              }}
            >
              V1 · In Upcoming
            </button>
            <button
              type="button"
              className={`${styles.protoToggleBtn} ${spreadVariant === 'v2' ? styles.protoToggleBtnActive : ''}`}
              onClick={() => {
                setSpreadVariant('v2')
                setShowFlexibleUpcomingAll(false)
              }}
            >
              V2 · Flexible Upcoming
            </button>
            <button
              type="button"
              className={`${styles.protoToggleBtn} ${spreadVariant === 'v3' ? styles.protoToggleBtnActive : ''}`}
              onClick={() => {
                setSpreadVariant('v3')
                setShowFlexibleUpcomingAll(false)
              }}
            >
              V3 · Separate Widget
            </button>
          </div>
        </section>

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

        {spreadVariant === 'v2' ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle title="Upcoming (flexible prototype)" showChevron={false} />
            <div className={styles.flexUpcomingCard}>
              <p className={styles.flexLabel}>Pinned rows</p>
              {flexiblePinnedRows.map((row) => (
                <div
                  key={row.id}
                  className={`${styles.flexRow} ${row.warn ? styles.flexRowWarn : ''}`}
                >
                  <div>
                    <p className={styles.flexRowTitle}>{row.title}</p>
                    <p className={styles.flexRowHint}>{row.hint}</p>
                  </div>
                  <p className={styles.flexRowAmount}>{row.amount}</p>
                </div>
              ))}
              <button
                type="button"
                className={styles.flexExpandBtn}
                onClick={() => setShowFlexibleUpcomingAll((v) => !v)}
              >
                {showFlexibleUpcomingAll ? 'Hide full upcoming list' : 'View all upcoming items'}
              </button>

              {showFlexibleUpcomingAll ? (
                <div className={styles.flexAll}>
                  <p className={styles.flexLabel}>All upcoming (prototype drill-in)</p>
                  {flexibleAllRows.map((row) => (
                    <div key={row.id} className={styles.flexRow}>
                      <div>
                        <p className={styles.flexRowTitle}>{row.title}</p>
                        <p className={styles.flexRowHint}>{row.hint}</p>
                      </div>
                      <p className={styles.flexRowAmount}>{row.amount}</p>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          </>
        ) : null}

        {showUpcomingBlock ? (
          <>
            <div className={styles.sectionSpacer} aria-hidden />
            <SectionTitle title="Upcoming" showChevron={false} />
            {upcomingItems.map((row) => (
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
            {spreadVariant === 'v1'
              ? spreadRowsV1.map((row) => (
                  <TransactionRow
                    key={row.id}
                    icon={<RowIconTabler kind={row.icon} />}
                    title={row.title}
                    amount={row.amount}
                    lines={row.lines}
                    date={row.date}
                  />
                ))
              : null}
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
