import { IconChevronRight } from '@tabler/icons-react'
import { BoosterBadge } from '../../../ui/BoosterBadge'
import { RewardEventIcon } from '../../../ui/RewardEventIcon'
import type { ChipTone, HeroIcon } from '../../../domain/reward/types'
import type { DetailRow } from '../configs/types'
import styles from '../RewardDetailModal.module.css'

type HeroProps = {
  heroIcon: HeroIcon
  amount: string
  amountTone?: 'negative'
  chipText: string
  chipClass: string
}

export function DetailHero({ heroIcon, amount, chipText, chipClass }: HeroProps) {
  return (
    <div className={styles.hero}>
      <div className={styles.heroIcon}>
        <RewardEventIcon kind={heroIcon} size={28} stroke={1.75} />
      </div>
      <p className={styles.heroAmount}>{amount}</p>
      <span className={`${styles.chip} ${chipClass}`}>{chipText}</span>
    </div>
  )
}

export function DetailFieldList({ rows }: { rows: DetailRow[] }) {
  return (
    <div className={styles.details}>
      {rows.map((row) => (
        <div
          key={row.label}
          className={`${styles.detailRow} ${row.chevron ? styles.detailRowNav : ''}`}
        >
          <p className={styles.detailLabel}>{row.label}</p>
          <div className={styles.detailValueWrap}>
            {row.valueDisplay === 'boosterTier' ? (
              <BoosterBadge variant="tier">{row.value}</BoosterBadge>
            ) : (
              <p className={styles.detailValue}>{row.value}</p>
            )}
            {row.chevron ? (
              <IconChevronRight size={20} stroke={2} className={styles.detailChevron} aria-hidden />
            ) : null}
          </div>
        </div>
      ))}
    </div>
  )
}

export function chipClassFor(
  tone: ChipTone,
  stylesMap: {
    chipWarning: string
    chipSuccess: string
    chipNegative: string
    chipNeutral: string
  },
): string {
  switch (tone) {
    case 'warning':
      return stylesMap.chipWarning
    case 'success':
      return stylesMap.chipSuccess
    case 'negative':
      return stylesMap.chipNegative
    default:
      return stylesMap.chipNeutral
  }
}

export { styles as detailModalStyles }
