import { RewardEventIcon } from './RewardEventIcon'
import { HIDE_TRANSACTION_BADGES } from '../../domain/reward/featureFlags'
import type { AmountTone } from '../../domain/reward/types'
import type { TransactionRowModel } from '../../domain/reward/transactionTypes'
import styles from './TransactionRow.module.css'

type Props = TransactionRowModel & {
  onClick?: () => void
}

function amountClassName(_tone?: AmountTone): string {
  return styles.amount
}

export function TransactionRow({
  icon,
  title,
  amount,
  amountTone,
  lines,
  trailing,
  badge,
  onClick,
}: Props) {
  const inner = (
    <>
      <div className={styles.iconWrap}>
        <RewardEventIcon kind={icon} />
      </div>
      <div className={styles.body}>
        <div className={styles.head}>
          {badge ? (
            <div className={styles.titleWithBadge}>
              <p className={styles.title}>{title}</p>
              <span
                className={`${styles.badge} ${HIDE_TRANSACTION_BADGES ? styles.badgeHidden : ''}`}
              >
                {badge}
              </span>
            </div>
          ) : (
            <p className={styles.title}>{title}</p>
          )}
          <p className={amountClassName(amountTone)}>{amount}</p>
        </div>
        <div className={styles.descRow}>
          <div className={styles.desc}>
            {lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className={styles.trailing}>{trailing}</p>
        </div>
      </div>
    </>
  )

  if (onClick) {
    return (
      <button type="button" className={styles.rowClickable} onClick={onClick}>
        {inner}
      </button>
    )
  }

  return <div className={styles.row}>{inner}</div>
}
