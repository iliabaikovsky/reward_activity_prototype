import type { DetailRow } from '../../../domain/reward/types'

const AVAILABLE_REWARDS = 'Available rewards'
const DEFAULT_ACCOUNT = '#12345678'

/** Loyalty pack hero: When → To → Why */
export function loyaltyPackDetailRows(
  whenLabel: 'Available on' | 'Activated on',
  whenValue: string,
  periodLabel: string,
): DetailRow[] {
  return [
    { label: whenLabel, value: whenValue },
    { label: 'To', value: AVAILABLE_REWARDS },
    { label: 'For trading on', value: periodLabel },
  ]
}

/** Cashback pack hero: When → [To account] → Why */
export function cashbackPackDetailRows(
  whenLabel: 'Credits on' | 'Credited on',
  whenValue: string,
  tradeDay: string,
  toAccount?: string,
): DetailRow[] {
  const rows: DetailRow[] = [{ label: whenLabel, value: whenValue }]
  if (toAccount) {
    rows.push({ label: 'To account', value: toAccount })
  }
  rows.push({ label: 'For trading with EXD on', value: tradeDay })
  return rows
}

export { DEFAULT_ACCOUNT as PACK_DEFAULT_ACCOUNT }
