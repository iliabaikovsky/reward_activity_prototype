/** Cashback rate row + info sheet (no spread USD, no Calculation sheet). */

export const CASHBACK_REBATE_SHARE_PERCENT = 50

export const CASHBACK_RATE_LABEL = 'Cashback rate'

export function formatCashbackRateValue(percent: number = CASHBACK_REBATE_SHARE_PERCENT): string {
  const rounded = Math.round(percent * 10) / 10
  const token = Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
  return `${token}% of spread`
}

export const CASHBACK_RATE_SHEET_TITLE = 'Cashback rate'

export const CASHBACK_RATE_SHEET_LEAD =
  'We debit EXD up to 50% of the spread on this order and convert it to USD cashback at 1 EXD = 1 USD (prototype).'

export const CASHBACK_RATE_SHEET_SECONDARY =
  'The debited percentage may be lower only if there was not enough EXD on your trading account to debit half of the spread.'
