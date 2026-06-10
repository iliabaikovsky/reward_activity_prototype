import type { ChipTone, DetailRow } from '../../../domain/reward/types'
import { CONVERTED_ON_LABEL } from './cashbackConversionExplainer'
import { EXD_DEBITED_LABEL } from './cashbackExdDebitExplainer'
import {
  CASHBACK_RATE_LABEL,
  formatCashbackRateValue,
} from './cashbackRateExplainer'

const CASHBACK_ACCOUNT = '#12345678'

/** Trading account on cashback order leg (conversion context; not From/To wallet). */
const CASHBACK_ACCOUNT_LABEL = 'Account'

/** Chip on every EXD → Cashback leg (pack Upcoming or Credited). */
export const CASHBACK_LEG_CHIP: { text: string; tone: ChipTone } = {
  text: 'Debited',
  tone: 'neutral',
}

/** Order detail — upcoming leg: Converted on → To → EXD debited → trade day → Order → rate. */
export function cashbackUpcomingOrderDetailRows(
  convertedOnUtc: string,
  account: string,
  tradeDay: string,
  orderNum: string,
  exdDebitedFormatted: string,
): DetailRow[] {
  return [
    {
      label: CONVERTED_ON_LABEL,
      value: convertedOnUtc,
      infoIcon: true,
      valueDisplay: 'modalDatetime',
    },
    { label: CASHBACK_ACCOUNT_LABEL, value: account },
    { label: EXD_DEBITED_LABEL, value: exdDebitedFormatted, infoIcon: true },
    { label: 'For trading with EXD on', value: tradeDay },
    { label: 'Order', value: orderNum },
    {
      label: CASHBACK_RATE_LABEL,
      value: formatCashbackRateValue(),
      infoIcon: true,
    },
  ]
}

/** Order detail — credited leg: Converted on → From → EXD debited → trade day → Order → rate. */
export function cashbackCreditedOrderDetailRows(
  convertedOnUtc: string,
  tradeDay: string,
  orderNum: string,
  exdDebitedFormatted: string,
): DetailRow[] {
  return [
    {
      label: CONVERTED_ON_LABEL,
      value: convertedOnUtc,
      infoIcon: true,
      valueDisplay: 'modalDatetime',
    },
    { label: CASHBACK_ACCOUNT_LABEL, value: CASHBACK_ACCOUNT },
    { label: EXD_DEBITED_LABEL, value: exdDebitedFormatted, infoIcon: true },
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
