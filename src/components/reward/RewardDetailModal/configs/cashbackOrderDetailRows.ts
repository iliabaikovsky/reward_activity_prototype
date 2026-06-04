import type { ChipTone, DetailRow } from '../../../domain/reward/types'
import { EXD_DEBITED_LABEL } from './cashbackExdDebitExplainer'
import { CALCULATION_ROW_LABEL, CALCULATION_ROW_VALUE } from './rewardCalculationExplainer'

const CASHBACK_ACCOUNT = '#12345678'

/** Chip on every EXD → Cashback leg (pack Upcoming or Credited). */
export const CASHBACK_LEG_CHIP: { text: string; tone: ChipTone } = {
  text: 'Debited',
  tone: 'neutral',
}

/** Order detail for Upcoming cashback leg (USD hero; EXD spend explained below). */
export function cashbackUpcomingOrderDetailRows(
  account: string,
  tradeDay: string,
  orderNum: string,
  exdDebitedFormatted: string,
): DetailRow[] {
  return [
    { label: 'To account', value: account },
    { label: EXD_DEBITED_LABEL, value: exdDebitedFormatted, infoIcon: true },
    { label: 'For trading with EXD on', value: tradeDay },
    { label: 'Order', value: orderNum, chevron: true },
    {
      label: CALCULATION_ROW_LABEL,
      value: CALCULATION_ROW_VALUE,
      chevron: true,
      valueDisplay: 'navDetail',
    },
  ]
}

/** Поля деталки одного cashback-ордера (EXD → Cashback leg, credited). */
export function cashbackOrderDetailRows(
  tradeDay: string,
  orderNum: string,
  debitedOnValue: string,
): DetailRow[] {
  return [
    { label: 'Debited on', value: debitedOnValue },
    { label: 'From account', value: CASHBACK_ACCOUNT },
    { label: 'For trading with EXD on', value: tradeDay },
    { label: 'Order', value: orderNum, chevron: true },
    {
      label: CALCULATION_ROW_LABEL,
      value: CALCULATION_ROW_VALUE,
      chevron: true,
      valueDisplay: 'navDetail',
    },
  ]
}
