import { IconChevronRight, IconInfoCircle } from '@tabler/icons-react'
import { AppH2 } from '../../../ui/AppHeading'
import { BoosterBadge } from '../../../ui/BoosterBadge'
import { RewardEventIcon } from '../../../ui/RewardEventIcon'
import type { ChipTone, HeroIcon } from '../../../domain/reward/types'
import type { DetailRow } from '../configs/types'
import { isCashbackConversionLabel } from '../configs/cashbackConversionExplainer'
import { EXD_DEDUCTED_LABEL } from '../configs/cashbackExdDebitExplainer'
import { CASHBACK_RATE_LABEL } from '../configs/cashbackRateExplainer'
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
      <AppH2 className={styles.heroAmount}>{amount}</AppH2>
      <span className={`${styles.chip} ${chipClass}`}>{chipText}</span>
    </div>
  )
}

type DetailFieldListProps = {
  rows: DetailRow[]
  onOrderClick?: (orderNum: string) => void
  onExdDebitedClick?: () => void
  onCashbackConversionClick?: () => void
  onCashbackRateClick?: () => void
}

export function DetailFieldList({
  rows,
  onOrderClick,
  onExdDebitedClick,
  onCashbackConversionClick,
  onCashbackRateClick,
}: DetailFieldListProps) {
  return (
    <div className={styles.details}>
      {rows.map((row) => {
        const isOrderNav = row.label === 'Order' && row.chevron && onOrderClick
        const isExdDebitedNav =
          row.label === EXD_DEDUCTED_LABEL && row.infoIcon && onExdDebitedClick
        const isConversionNav =
          row.infoIcon && isCashbackConversionLabel(row.label) && onCashbackConversionClick
        const isCashbackRateNav =
          row.label === CASHBACK_RATE_LABEL && row.infoIcon && onCashbackRateClick
        const isNav =
          isOrderNav || isExdDebitedNav || isConversionNav || isCashbackRateNav
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
                : isExdDebitedNav
                  ? onExdDebitedClick
                  : isConversionNav
                    ? onCashbackConversionClick
                    : isCashbackRateNav
                      ? onCashbackRateClick
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
              ) : row.valueDisplay === 'modalDatetime' ? (
                <>
                  <p className={`${styles.detailValue} ${styles.detailValueDatetime}`}>
                    {row.value}
                  </p>
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
