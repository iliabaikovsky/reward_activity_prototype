/** Copy for Share of spread stacked sheet from cashback Calculation. */

export const SPREAD_SHARE_SHEET_TITLE = 'Share of spread'

export function formatSharePercentToken(percent: number): string {
  const rounded = Math.round(percent * 10) / 10
  return Number.isInteger(rounded) ? String(rounded) : rounded.toFixed(1)
}

function spreadDebitTargetPhrase(maxPercent: number): string {
  if (maxPercent === 50) return 'half'
  const p = formatSharePercentToken(maxPercent)
  return `the full ${p}%`
}

/** Program cap on this order. */
export function formatSpreadShareLead(maxPercent: number): string {
  const p = formatSharePercentToken(maxPercent)
  return `We debit EXD in the amount of up to ${p}% of the spread on this order.`
}

/** Balance caveat; "half" when program max is 50%. */
export function formatSpreadShareSecondary(maxPercent: number): string {
  const target = spreadDebitTargetPhrase(maxPercent)
  return `The debited percentage may be lower only if there was not enough EXD on your trading account to debit ${target} of the spread.`
}
