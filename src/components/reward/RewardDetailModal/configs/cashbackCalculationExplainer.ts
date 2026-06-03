/** Copy for EXD → Cashback Calculation sheet + entry row. */

export {
  CALCULATION_ROW_LABEL,
  CALCULATION_ROW_VALUE,
  REWARD_CALCULATION_SHEET_TITLE,
} from './rewardCalculationExplainer'

import { formatSharePercentToken } from './rebateShareExplainer'

/** Subline under formula on Calculation sheet (this order). */
export function formatCashbackCalculationFormulaExpanded(sharePercent: number): string {
  const p = formatSharePercentToken(sharePercent)
  return `The EXD were deducted equal to ${p}% of the spread for this order, to be paid out as cashback at a rate of 1 EXD = 1 USD.`
}

export const CASHBACK_CALCULATION_SPREAD = 'Spread'
export const CASHBACK_CALCULATION_SHARE_OF_SPREAD = 'Share of spread'
