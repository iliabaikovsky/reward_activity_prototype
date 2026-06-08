import { IconChevronRight, IconClock, IconX } from '@tabler/icons-react'
import type { TradingOrderRewardsEntry } from '../../../../domain/reward/tradingOrder'
import { formatRewardsExd, formatRewardsUsd } from '../../../../domain/reward/tradingOrder'
import {
  closedOrderDetailFields,
  closedOrderSummaryFor,
} from '../configs/closedOrderDemo'
import { AppH3, AppH4 } from '../../../ui/AppHeading'
import styles from './ClosedOrderSheet.module.css'

export type ClosedOrderPanelProps = {
  orderNum: string
  rewards: TradingOrderRewardsEntry | undefined
  onClose: () => void
  onOpenChart?: (orderNum: string) => void
  /** Drill to loyalty order detail in parent modal. */
  onOpenExdEarned?: () => void
  /** Drill to cashback order detail in parent modal. */
  onOpenCashback?: () => void
  embedInChartView?: boolean
  onBackToRewards?: () => void
  /** Inline bottom panel on chart screen (not portal overlay). */
  layout?: 'inline' | 'modal'
  titleId?: string
}

type RewardRowProps = {
  label: string
  value: string
  pending?: boolean
  onOpen?: () => void
}

function RewardRow({ label, value, pending, onOpen }: RewardRowProps) {
  const isNav = Boolean(onOpen)
  const RowTag = isNav ? 'button' : 'div'

  return (
    <RowTag
      type={isNav ? 'button' : undefined}
      className={isNav ? `${styles.row} ${styles.rowButton}` : styles.row}
      onClick={(e) => {
        e.stopPropagation()
        onOpen?.()
      }}
      aria-label={isNav ? `Open ${label}` : undefined}
    >
      <p className={styles.rowLabel}>{label}</p>
      <div className={styles.rowValueWrap}>
        <p className={styles.rowValue}>{value}</p>
        {pending ? (
          <IconClock size={20} stroke={2} className={styles.clockIcon} aria-hidden />
        ) : null}
        {isNav ? (
          <IconChevronRight size={20} stroke={2} className={styles.chevron} aria-hidden />
        ) : null}
      </div>
    </RowTag>
  )
}

export function ClosedOrderPanel({
  orderNum,
  rewards,
  onClose,
  onOpenChart,
  onOpenExdEarned,
  onOpenCashback,
  embedInChartView = false,
  onBackToRewards,
  layout = 'modal',
  titleId = 'closed-order-sheet-title',
}: ClosedOrderPanelProps) {
  const summary = closedOrderSummaryFor(orderNum)
  const fields = closedOrderDetailFields(orderNum).filter(
    (f) => !(embedInChartView && f.label === 'Chart'),
  )

  const showExdEarned = (rewards?.exdEarned?.amountExd ?? 0) > 0
  const showCashback = (rewards?.cashbackFromExd?.amountUsd ?? 0) > 0
  const showRewardsSection = showExdEarned || showCashback
  const isInline = layout === 'inline'

  return (
    <div className={isInline ? styles.inlineRoot : styles.sheetBody}>
      {isInline ? (
        <div className={styles.inlineGrabber} aria-hidden>
          <span className={styles.inlineGrabberBar} />
        </div>
      ) : null}

      <header className={styles.header}>
        {embedInChartView ? (
          <span aria-hidden className={styles.headerSpacer} />
        ) : (
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
        )}
        <AppH4 className={styles.navTitle} id={titleId}>
          #{orderNum}
        </AppH4>
        <span aria-hidden className={styles.headerSpacer} />
      </header>

      <div className={styles.scroll}>
        <div className={styles.summary}>
          <span className={styles.pairIcon} aria-hidden />
          <div className={styles.summaryTop}>
            <p className={styles.symbol}>{summary.symbol}</p>
            <p
              className={
                summary.pnlTone === 'success' ? styles.pnlSuccess : styles.pnlNegative
              }
            >
              {summary.pnl}
            </p>
          </div>
          <div className={styles.summaryBottom}>
            <p className={styles.lotLine}>
              <span className={styles.lotBuy}>{summary.side} </span>
              <span className={styles.lotMuted}>
                {summary.lot} at {summary.openPrice}
              </span>
            </p>
            <p className={styles.closePrice}>{summary.closePrice}</p>
          </div>
        </div>

        {fields.map((field) => {
          const isChartNav = field.label === 'Chart' && field.chevron && onOpenChart
          const RowTag = isChartNav ? 'button' : 'div'
          return (
            <RowTag
              key={field.label}
              type={isChartNav ? 'button' : undefined}
              className={isChartNav ? `${styles.row} ${styles.rowButton}` : styles.row}
              onClick={isChartNav ? () => onOpenChart!(orderNum) : undefined}
            >
              <p className={styles.rowLabel}>{field.label}</p>
              <div className={styles.rowValueWrap}>
                {field.label === 'Closed by' ? (
                  <span className={styles.closedByChip}>{field.value}</span>
                ) : (
                  <p className={styles.rowValue}>{field.value}</p>
                )}
                {field.chevron ? (
                  <IconChevronRight size={20} stroke={2} className={styles.chevron} aria-hidden />
                ) : null}
              </div>
            </RowTag>
          )
        })}

        {showRewardsSection ? (
          <AppH3 className={styles.rewardsHeadingStatic}>Rewards</AppH3>
        ) : null}

        {showExdEarned ? (
          <RewardRow
            label="EXD earned"
            value={formatRewardsExd(rewards!.exdEarned!.amountExd)}
            pending={rewards!.exdEarned!.pending}
            onOpen={onOpenExdEarned}
          />
        ) : null}

        {showCashback ? (
          <RewardRow
            label="Cashback from EXD"
            value={formatRewardsUsd(rewards!.cashbackFromExd!.amountUsd)}
            pending={rewards!.cashbackFromExd!.pending}
            onOpen={onOpenCashback}
          />
        ) : null}
      </div>

      {embedInChartView && onBackToRewards ? (
        <footer className={styles.chartFooter}>
          <button type="button" className={styles.backToRewardsBtn} onClick={onBackToRewards}>
            Back to Exness Rewards
          </button>
        </footer>
      ) : null}
    </div>
  )
}
