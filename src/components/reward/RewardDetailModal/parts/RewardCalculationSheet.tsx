import { IconInfoCircle, IconX } from '@tabler/icons-react'
import { ModalSheet } from '../../../ui/ModalSheet'
import { BoosterBadge } from '../../../ui/BoosterBadge'
import type { LoyaltyRewardCalculation } from '../../../../domain/reward/loyaltyRewardCalculation'
import {
  formatCalculationFormulaLine,
  formatExdSpentValue,
  formatSpreadUsdValue,
} from '../../../../domain/reward/loyaltyRewardCalculation'
import {
  REWARD_CALCULATION_BOOSTER,
  REWARD_CALCULATION_EARNING_RATE,
  REWARD_CALCULATION_EXD_SPENT,
  REWARD_CALCULATION_EXD_SPENT_RATE,
  REWARD_CALCULATION_FORMULA_EXPANDED,
  REWARD_CALCULATION_SHEET_TITLE,
  REWARD_CALCULATION_SPREAD,
} from '../configs/rewardCalculationExplainer'
import styles from './RewardCalculationSheet.module.css'

type Props = {
  open: boolean
  calculation: LoyaltyRewardCalculation | null
  onClose: () => void
  onEarningRateClick?: () => void
}

export function RewardCalculationSheet({
  open,
  calculation,
  onClose,
  onEarningRateClick,
}: Props) {
  const titleId = 'reward-calculation-sheet-title'
  if (!calculation) return null

  const formulaLine = formatCalculationFormulaLine(calculation)
  const zeroEarned = calculation.exdEarnedDisplay <= 0

  return (
    <ModalSheet open={open} onClose={onClose} titleId={titleId} detent="large" stacked>
      <div className={styles.sheetBody}>
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
          <h2 className={styles.navTitle} id={titleId}>
            {REWARD_CALCULATION_SHEET_TITLE}
          </h2>
          <span aria-hidden className={styles.headerSpacer} />
        </header>

        <div className={styles.scroll}>
          {zeroEarned ? (
            <p className={styles.zeroNote}>
              No EXD earned because EXD spent on cashback equaled or exceeded the trade spread.
            </p>
          ) : null}

          <p className={styles.formulaHero}>{formulaLine}</p>
          <p className={styles.formulaExpanded}>{REWARD_CALCULATION_FORMULA_EXPANDED}</p>

          <div className={styles.rows}>
            <div className={styles.row}>
              <div className={styles.rowLabelCol}>
                <p className={styles.rowLabel}>{REWARD_CALCULATION_SPREAD}</p>
                <p className={styles.rowSublabel}>{calculation.spreadConversionNote}</p>
              </div>
              <p className={styles.rowValue}>{formatSpreadUsdValue(calculation.spreadUsd)}</p>
            </div>

            <div className={styles.row}>
              <div className={styles.rowLabelCol}>
                <p className={styles.rowLabel}>{REWARD_CALCULATION_EXD_SPENT}</p>
                <p className={styles.rowSublabel}>{REWARD_CALCULATION_EXD_SPENT_RATE}</p>
              </div>
              <p className={styles.rowValue}>
                {formatExdSpentValue(calculation.exdSpentUsd)}
              </p>
            </div>

            {onEarningRateClick ? (
              <button
                type="button"
                className={`${styles.row} ${styles.rowInteractive}`}
                onClick={onEarningRateClick}
              >
                <p className={styles.rowLabel}>{REWARD_CALCULATION_EARNING_RATE}</p>
                <div className={styles.rowValueWrap}>
                  <p className={styles.rowValue}>{calculation.earningRatePercent}%</p>
                  <IconInfoCircle size={20} stroke={2} className={styles.infoIcon} aria-hidden />
                </div>
              </button>
            ) : (
              <div className={styles.row}>
                <p className={styles.rowLabel}>{REWARD_CALCULATION_EARNING_RATE}</p>
                <p className={styles.rowValue}>{calculation.earningRatePercent}%</p>
              </div>
            )}

            <div className={styles.row}>
              <p className={styles.rowLabel}>{REWARD_CALCULATION_BOOSTER}</p>
              <BoosterBadge variant="tier">{calculation.boosterTierValue}</BoosterBadge>
            </div>
          </div>
        </div>
      </div>
    </ModalSheet>
  )
}
