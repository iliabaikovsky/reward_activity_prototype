import { closedOrderSummaryFor } from '../components/reward/RewardDetailModal/configs/closedOrderDemo'
import { ClosedOrderPanel } from '../components/reward/RewardDetailModal/parts/ClosedOrderPanel'
import type { TradingOrderRewardsEntry } from '../domain/reward/tradingOrder'
import { TradingChartBackground } from './parts/TradingChartBackground'
import styles from './OrderChartScreen.module.css'

type Props = {
  orderNum: string
  rewards: TradingOrderRewardsEntry | undefined
  onBackToRewards: () => void
}

/**
 * Chart + order details share one column: chart shrinks, detail panel pushes from below
 * (not a portal overlay on top of the chart).
 */
export function OrderChartScreen({ orderNum, rewards, onBackToRewards }: Props) {
  const summary = closedOrderSummaryFor(orderNum)
  const titleId = 'chart-closed-order-title'

  return (
    <div className={styles.screen} data-node-id="proto-order-chart">
      <div className={styles.chartRegion} aria-hidden={false}>
        <TradingChartBackground summary={summary} fillParent />
      </div>

      <section
        className={styles.detailRegion}
        role="dialog"
        aria-modal="false"
        aria-labelledby={titleId}
      >
        <ClosedOrderPanel
          layout="inline"
          titleId={titleId}
          orderNum={orderNum}
          rewards={rewards}
          embedInChartView
          onClose={onBackToRewards}
          onBackToRewards={onBackToRewards}
        />
      </section>
    </div>
  )
}
