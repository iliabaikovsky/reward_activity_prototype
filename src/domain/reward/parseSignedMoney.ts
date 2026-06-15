import { parseSignedAmount } from '../../rewardLifecycle/rebateSimulatorSteps'

export type SignedMoney = {
  value: number
  currency: string
}

/** Parse "+148.50 THB", "+672 JPY", legacy "+4.50 USD". */
export function parseSignedMoney(amount: string): SignedMoney {
  const trimmed = amount.replace(/,/g, '').trim()
  const withCode = trimmed.match(/^([+-]?)\s*([\d.]+)\s+([A-Za-z]{3})$/)
  if (withCode) {
    const n = parseFloat(withCode[2])
    return {
      value: Number.isFinite(n) ? Math.abs(n) : 0,
      currency: withCode[3].toUpperCase(),
    }
  }
  return { value: parseSignedAmount(amount), currency: 'USD' }
}

function moneyDecimals(currency: string): number {
  return currency === 'JPY' ? 0 : 2
}

/** Format positive amount with currency code (+148.50 THB, +672 JPY). */
export function formatSignedMoney(value: number, currency: string, signed = true): string {
  const prefix = signed ? '+' : ''
  return `${prefix}${value.toFixed(moneyDecimals(currency))} ${currency}`
}

export function unsignedMoneyLabel(amount: string): string {
  return amount.replace(/^\s*[+-]\s*/, '').trim()
}

/** Unique fiat codes in amounts (ignores EXD). */
export function distinctFiatCurrencies(amounts: string[]): string[] {
  const codes = new Set<string>()
  for (const amount of amounts) {
    const { currency } = parseSignedMoney(amount)
    if (currency !== 'EXD') codes.add(currency)
  }
  return [...codes]
}

export function hasMixedFiatCurrencies(amounts: string[]): boolean {
  return distinctFiatCurrencies(amounts).length > 1
}

/** Prototype FX: local fiat → USD equivalent for Upcoming summary on Rewards home. */
const APPROX_FIAT_PER_USD: Record<string, number> = {
  USD: 1,
  THB: 34.2,
  JPY: 150,
  INR: 85,
}

export function fiatToUsdEquivalent(value: number, currency: string): number {
  const rate = APPROX_FIAT_PER_USD[currency] ?? 1
  return Math.round((value / rate) * 100) / 100
}

/** Sum cashback upcoming lines as USD (Rewards home aggregate). */
export function sumCashbackAmountsAsUsd(amounts: string[]): number {
  return amounts.reduce((acc, amount) => {
    const { value, currency } = parseSignedMoney(amount)
    return acc + fiatToUsdEquivalent(value, currency)
  }, 0)
}
