import { IconChevronRight, IconInfoCircle } from '@tabler/icons-react'
import { BoosterBadge } from '../../../ui/BoosterBadge'
import { RewardEventIcon } from '../../../ui/RewardEventIcon'
import type { ChipTone, HeroIcon } from '../../../domain/reward/types'
import type { DetailRow } from '../configs/types'
import { EXD_DEBITED_LABEL } from '../configs/cashbackExdDebitExplainer'
import { CALCULATION_ROW_LABEL } from '../configs/rewardCalculationExplainer'
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

type DetailFieldListProps = {
  rows: DetailRow[]
  onOrderClick?: (orderNum: string) => void
  onEarningRateClick?: () => void
  onExdDebitedClick?: () => void
  onCalculationClick?: () => void
}

export function DetailFieldList({
  rows,
  onOrderClick,
  onEarningRateClick,
  onExdDebitedClick,
  onCalculationClick,
}: DetailFieldListProps) {
  return (
    <div className={styles.details}>
      {rows.map((row) => {
        const isOrderNav = row.label === 'Order' && row.chevron && onOrderClick
        const isEarningRateNav =
          row.label === 'Earning rate' && row.infoIcon && onEarningRateClick
        const isExdDebitedNav =
          row.label === EXD_DEBITED_LABEL && row.infoIcon && onExdDebitedClick
        const isCalculationNav =
          row.label === CALCULATION_ROW_LABEL && row.chevron && onCalculationClick
        const isNav = isOrderNav || isEarningRateNav || isExdDebitedNav || isCalculationNav
        const RowTag = isNav ? 'button' : 'div'
        const isNavDetail = row.valueDisplay === 'navDetail'

        return (
          <RowTag
            key={row.label}
            type={isNav ? 'button' : undefined}
            className={styles.detailRow}
            onClick={
              isOrderNav
                ? () => onOrderClick!(row.value)
                : isEarningRateNav
                  ? onEarningRateClick
                  : isExdDebitedNav
                    ? onExdDebitedClick
                    : isCalculationNav
                      ? onCalculationClick
                      : undefined
            }
          >
            <p className={styles.detailLabel}>{row.label}</p>
            <div className={styles.detailValueWrap}>
              {row.valueDisplay === 'boosterTier' ? (
                <BoosterBadge variant="tier">{row.value}</BoosterBadge>
              ) : isNavDetail ? (
                <>
                  <p className={styles.detailNavValue}>{row.value}</p>
                  {row.chevron ? (
                    <IconChevronRight
                      size={20}
                      stroke={2}
                      className={styles.detailChevron}
                      aria-hidden
                    />
                  ) : null}
                </>
              ) : (
                <>
                  <p className={styles.detailValue}>{row.value}</p>
                  {row.chevron ? (
                    <IconChevronRight
                      size={20}
                      stroke={2}
                      className={styles.detailChevron}
                      aria-hidden
                    />
                  ) : null}
                  {row.infoIcon ? (
                    <IconInfoCircle
                      size={20}
                      stroke={2}
                      className={styles.detailInfoIcon}
                      aria-hidden
                    />
                  ) : null}
                </>
              )}
            </div>
          </RowTag>
        )
      })}
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
