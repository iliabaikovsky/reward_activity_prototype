import { IconChevronLeft } from '@tabler/icons-react'
import type { RebateDemoState } from '../rewardLifecycle/rebateSimulatorSteps'
import { buildRebateLedgerLines } from '../rewardLifecycle/rebateLedgerDemo'
import { AppH3 } from '../components/ui/AppHeading'
import styles from './SpreadRebateLedgerScreen.module.css'

type Props = {
  onBack: () => void
  rebateDemo: RebateDemoState
  rebateScenarioId: string
}

export function SpreadRebateLedgerScreen({ onBack, rebateDemo, rebateScenarioId }: Props) {
  const lines = buildRebateLedgerLines(rebateDemo, rebateScenarioId)

  return (
    <div className={styles.screen}>
      <div className={styles.statusBar}>
        <span className={styles.statusTime}>9:41</span>
        <span className={styles.statusRight} aria-hidden />
      </div>
      <header className={styles.header}>
        <button type="button" className={styles.back} onClick={onBack} aria-label="Back">
          <IconChevronLeft size={22} stroke={2} aria-hidden />
        </button>
        <AppH3 className={styles.title}>Spread rebates</AppH3>
      </header>
      <div className={styles.intro}>
        <p className={styles.introTotals}>
          {rebateDemo.pendingExd} · {rebateDemo.pendingUsd}
        </p>
        <p className={styles.introMeta}>
          {rebateDemo.pendingCount} payout slots · Next {rebateDemo.nextPayoutDate}
          {rebateDemo.paidExdCount > 0
            ? ` · ${rebateDemo.paidExdCount} mature EXD credits (${rebateDemo.paidExdAmount})`
            : null}
        </p>
      </div>
      {lines.length === 0 ? (
        <p className={styles.empty}>No pending spread rebate slots for this scenario.</p>
      ) : (
        <>
          <p className={styles.listHeader}>All payout slots</p>
          <div className={styles.list}>
            {lines.map((row) => (
              <div key={row.id} className={styles.row}>
                <div className={styles.rowMain}>
                  <p className={styles.rowTitle}>{row.slotLabel}</p>
                  <p className={styles.rowAmounts}>
                    {row.usd} · {row.exd}
                  </p>
                  <p className={styles.rowMeta}>Payout {row.payoutOn}</p>
                </div>
                <p className={styles.rowStatus}>{row.status}</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  )
}
