import { IconChartCandle, IconDotsVertical } from '@tabler/icons-react'
import type { ClosedOrderSummary } from '../../components/reward/RewardDetailModal/configs/closedOrderDemo'
import styles from './TradingChartBackground.module.css'

type Props = {
  summary: ClosedOrderSummary
  walletUsd?: string
  /** Fill parent chartRegion (order chart split layout). */
  fillParent?: boolean
}

export function TradingChartBackground({
  summary,
  walletUsd = '14.54 USD',
  fillParent = false,
}: Props) {
  return (
    <div
      className={fillParent ? `${styles.root} ${styles.rootFill}` : styles.root}
      aria-hidden
    >
      <header className={styles.topBar}>
        <div className={styles.pair}>
          <span className={styles.pairIcon} />
          <span className={styles.pairName}>{summary.symbol}</span>
        </div>
        <div className={styles.topRight}>
          <span className={styles.wallet}>{walletUsd}</span>
          <span className={styles.crown} aria-hidden>
            ♛
          </span>
          <IconDotsVertical size={20} stroke={2} className={styles.menuIcon} />
        </div>
      </header>

      <div className={styles.toolbar}>
        <span className={styles.tool}>☰</span>
        <span className={styles.toolActive}>1m</span>
        <IconChartCandle size={18} stroke={1.75} />
        <span className={styles.tool}>fx</span>
        <span className={styles.tool}>▦</span>
      </div>

      <div className={styles.chartArea}>
        <div className={styles.candles}>
          {Array.from({ length: 28 }).map((_, i) => (
            <span
              key={i}
              className={i % 5 === 0 ? styles.candleDown : styles.candleUp}
              style={{ height: `${28 + ((i * 17) % 40)}%` }}
            />
          ))}
        </div>
        <div className={styles.priceLine}>
          <span className={styles.priceTag}>{summary.closePrice}</span>
        </div>
      </div>
    </div>
  )
}
