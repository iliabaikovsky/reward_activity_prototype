import { IconChevronRight, IconClock, IconX } from '@tabler/icons-react'
import { ModalSheet } from '../../../ui/ModalSheet'
import type { TradingOrderRewardsEntry } from '../../../../domain/reward/tradingOrder'
import { formatRewardsExd, formatRewardsUsd } from '../../../../domain/reward/tradingOrder'
import {
  closedOrderDetailFields,
  closedOrderSummaryFor,
} from '../configs/closedOrderDemo'
import styles from './ClosedOrderSheet.module.css'

type Props = {
  open: boolean
  orderNum: string
  rewards: TradingOrderRewardsEntry | undefined
  onClose: () => void
  /** Chevron у заголовка Rewards — назад к детальке транзакции. */
  onRewardsBack: () => void
}

export function ClosedOrderSheet({
  open,
  orderNum,
  rewards,
  onClose,
  onRewardsBack,
}: Props) {
  const summary = closedOrderSummaryFor(orderNum)
  const fields = closedOrderDetailFields()
  const titleId = 'closed-order-sheet-title'

  const showExdEarned = (rewards?.exdEarned?.amountExd ?? 0) > 0
  const showCashback = (rewards?.cashbackFromExd?.amountUsd ?? 0) > 0

  return (
    <ModalSheet
      open={open}
      onClose={onClose}
      titleId={titleId}
      detent="large"
      stacked
    >
      <div className={styles.sheetBody}>
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
          <h2 className={styles.navTitle} id={titleId}>
            #{orderNum}
          </h2>
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

          {fields.map((field) => (
            <div key={field.label} className={styles.row}>
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
            </div>
          ))}

          <button
            type="button"
            className={styles.rewardsSectionTitle}
            onClick={onRewardsBack}
            aria-label="Back to transaction details"
          >
            <h3 className={styles.rewardsHeading}>Rewards</h3>
            <IconChevronRight size={24} stroke={2} className={styles.chevron} aria-hidden />
          </button>

          {showExdEarned ? (
            <div className={styles.row}>
              <p className={styles.rowLabel}>EXD earned</p>
              <div className={styles.rowValueWrap}>
                <p className={styles.rowValue}>
                  {formatRewardsExd(rewards!.exdEarned!.amountExd)}
                </p>
                {rewards!.exdEarned!.pending ? (
                  <IconClock size={20} stroke={2} className={styles.clockIcon} aria-hidden />
                ) : null}
              </div>
            </div>
          ) : null}

          {showCashback ? (
            <div className={styles.row}>
              <p className={styles.rowLabel}>Cashback from EXD</p>
              <div className={styles.rowValueWrap}>
                <p className={styles.rowValue}>
                  {formatRewardsUsd(rewards!.cashbackFromExd!.amountUsd)}
                </p>
                {rewards!.cashbackFromExd!.pending ? (
                  <IconClock size={20} stroke={2} className={styles.clockIcon} aria-hidden />
                ) : null}
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </ModalSheet>
  )
}
