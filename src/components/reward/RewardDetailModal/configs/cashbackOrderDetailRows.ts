import type { ChipTone, DetailRow } from '../../../domain/reward/types'
import { EXD_DEDUCTED_LABEL } from './cashbackExdDebitExplainer'
import {
  CASHBACK_RATE_LABEL,
  formatCashbackRateValue,
} from './cashbackRateExplainer'

/** Chip on every EXD → Cashback leg (pack Upcoming or Credited). */
export const CASHBACK_LEG_CHIP: { text: string; tone: ChipTone } = {
  text: 'Debited',
  tone: 'neutral',
}

/** Order detail — upcoming leg: EXD deducted → trade day → Order → rate. */
export function cashbackUpcomingOrderDetailRows(
  tradeDay: string,
  orderNum: string,
  exdDeductedFormatted: string,
): DetailRow[] {
  return [
    { label: EXD_DEDUCTED_LABEL, value: exdDeductedFormatted, infoIcon: true },
    { label: 'For trading with EXD on', value: tradeDay },
    { label: 'Order', value: orderNum },
    {
      label: CASHBACK_RATE_LABEL,
      value: formatCashbackRateValue(),
      infoIcon: true,
    },
  ]
}

/** Order detail — credited leg: same order as upcoming (no Converted on). */
export function cashbackCreditedOrderDetailRows(
  tradeDay: string,
  orderNum: string,
  exdDeductedFormatted: string,
): DetailRow[] {
  return [
    { label: EXD_DEDUCTED_LABEL, value: exdDeductedFormatted, infoIcon: true },
    { label: 'For trading with EXD on', value: tradeDay },
    { label: 'Order', value: orderNum },
    {
      label: CASHBACK_RATE_LABEL,
      value: formatCashbackRateValue(),
      infoIcon: true,
    },
  ]
}

/** @deprecated Use cashbackCreditedOrderDetailRows */
export const cashbackOrderDetailRows = cashbackCreditedOrderDetailRows
