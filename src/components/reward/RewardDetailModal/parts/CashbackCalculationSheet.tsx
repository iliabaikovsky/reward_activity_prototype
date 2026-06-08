import { IconInfoCircle, IconX } from '@tabler/icons-react'
import { AppH4 } from '../../../ui/AppHeading'
import { ModalSheet } from '../../../ui/ModalSheet'
import type { CashbackRebateCalculation } from '../../../../domain/reward/cashbackRebateCalculation'
import {
  formatCashbackFormulaLine,
  formatSpreadUsdValue,
} from '../../../../domain/reward/cashbackRebateCalculation'
import {
  formatCashbackCalculationFormulaExpanded,
  CASHBACK_CALCULATION_SHARE_OF_SPREAD,
  CASHBACK_CALCULATION_SPREAD,
  REWARD_CALCULATION_SHEET_TITLE,
} from '../configs/cashbackCalculationExplainer'
import styles from './RewardCalculationSheet.module.css'

type Props = {
  open: boolean
  calculation: CashbackRebateCalculation | null
  onClose: () => void
  onRebateShareClick?: () => void
}

export function CashbackCalculationSheet({
  open,
  calculation,
  onClose,
  onRebateShareClick,
}: Props) {
  const titleId = 'cashback-calculation-sheet-title'
  if (!calculation) return null

  const formulaLine = formatCashbackFormulaLine(calculation)

  return (
    <ModalSheet open={open} onClose={onClose} titleId={titleId} detent="large" stacked>
      <div className={styles.sheetBody}>
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
          <AppH4 className={styles.navTitle} id={titleId}>
            {REWARD_CALCULATION_SHEET_TITLE}
          </AppH4>
          <span aria-hidden className={styles.headerSpacer} />
        </header>

        <div className={styles.scroll}>
          <p className={styles.formulaHero}>{formulaLine}</p>
          <p className={styles.formulaExpanded}>
            {formatCashbackCalculationFormulaExpanded(calculation.rebateSharePercent)}
          </p>

          <div className={styles.rows}>
            <div className={styles.row}>
              <div className={styles.rowLabelCol}>
                <p className={styles.rowLabel}>{CASHBACK_CALCULATION_SPREAD}</p>
                <p className={styles.rowSublabel}>{calculation.spreadConversionNote}</p>
              </div>
              <p className={styles.rowValue}>{formatSpreadUsdValue(calculation.spreadUsd)}</p>
            </div>

            {onRebateShareClick ? (
              <button
                type="button"
                className={`${styles.row} ${styles.rowInteractive}`}
                onClick={onRebateShareClick}
              >
                <p className={styles.rowLabel}>{CASHBACK_CALCULATION_SHARE_OF_SPREAD}</p>
                <div className={styles.rowValueWrap}>
                  <p className={styles.rowValue}>{calculation.rebateSharePercent}%</p>
                  <IconInfoCircle size={20} stroke={2} className={styles.infoIcon} aria-hidden />
                </div>
              </button>
            ) : (
              <div className={styles.row}>
                <p className={styles.rowLabel}>{CASHBACK_CALCULATION_SHARE_OF_SPREAD}</p>
                <p className={styles.rowValue}>{calculation.rebateSharePercent}%</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </ModalSheet>
  )
}
