import type { ChipTone, DetailRow } from '../../../domain/reward/types'
import { CALCULATION_ROW_LABEL, CALCULATION_ROW_VALUE } from './rewardCalculationExplainer'

const CASHBACK_ACCOUNT = '#12345678'

/** Chip on every EXD → Cashback leg (pack Upcoming or Credited). */
export const CASHBACK_LEG_CHIP: { text: string; tone: ChipTone } = {
  text: 'Debited',
  tone: 'neutral',
}

/** Поля деталки одного cashback-ордера (EXD → Cashback leg). */
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
