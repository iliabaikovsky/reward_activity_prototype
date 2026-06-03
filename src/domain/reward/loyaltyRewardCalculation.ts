import { parseExdAbsolute } from './parseExd'
import type { TradingOrderRewardsEntry } from './tradingOrder'

/** Canonical demo economics for order 9088801 (Mar 9–15 activation). */
export const DEMO_LOYALTY_CALC_ORDER_ID = '9088801'

const DEMO_SPREAD_USD = 10.02
const DEMO_EXD_SPENT_USD = 0
const DEFAULT_EARNING_RATE_PERCENT = 5.34
const DEFAULT_BOOSTER_MULTIPLIER = 2
const DEFAULT_BOOSTER_LABEL = 'Ultimate ×2'

export type LoyaltyRewardCalculation = {
  exdEarnedDisplay: string
  exdEarnedPrecise: number
  orderNum: string
  account: string
  spreadUsd: number
  exdSpentUsd: number
  eligibleSpreadUsd: number
  earningRatePercent: number
  boosterMultiplier: number
  boosterLabel: string
  /** Tier chip copy as on order detail, e.g. `Ultimate · x2`. */
  boosterTierValue: string
  /** e.g. `342 THB → 10.49 USD` (Figma 42413:33231). */
  spreadConversionNote: string
}

export function parseEarningRatePercent(value: string): number {
  const m = value.replace(/,/g, '').match(/([\d.]+)\s*%/)
  return m && Number.isFinite(parseFloat(m[1])) ? parseFloat(m[1]) : DEFAULT_EARNING_RATE_PERCENT
}

/** `Ultimate · x2` → multiplier 2 and display label `Ultimate ×2`. */
export function parseBoosterFromTierValue(value: string): {
  multiplier: number
  label: string
} {
  const multMatch = value.match(/[×x]\s*(\d+(?:\.\d+)?)/i)
  const multiplier =
    multMatch && Number.isFinite(parseFloat(multMatch[1])) ? parseFloat(multMatch[1]) : 1
  const tier = value.split(/[·•]/)[0]?.trim() || 'Booster'
  const label = multiplier === 1 ? tier : `${tier} ×${formatMultiplier(multiplier)}`
  return { multiplier, label }
}

function formatMultiplier(n: number): string {
  return Number.isInteger(n) ? String(n) : n.toFixed(2).replace(/\.?0+$/, '')
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function formatUsdAmount(n: number, signed = false): string {
  const abs = Math.abs(n)
  const core = `$${abs.toFixed(2)}`
  if (!signed || n === 0) return core
  return n < 0 ? `−${core}` : core
}

export function formatUsdPlain(n: number): string {
  return formatUsdAmount(n)
}

export function formatUsdSpentLine(n: number): string {
  if (n === 0) return '−$0.00'
  return formatUsdAmount(-n, true)
}

/** Spread USD so formula rounds to displayed EXD (source: earned amount). */
/** Prototype FX line under Spread (Figma 342 THB → 10.49 USD). */
function spreadConversionNoteForUsd(spreadUsd: number): string {
  const thb = Math.round(spreadUsd * 32.6)
  return `${thb} THB → ${spreadUsd.toFixed(2)} USD`
}

function spreadFromEarned(
  exdEarned: number,
  earningRatePercent: number,
  boosterMultiplier: number,
  exdSpentUsd: number,
): number {
  const rate = earningRatePercent / 100
  const denom = rate * boosterMultiplier
  if (denom <= 0) return Math.max(0, exdSpentUsd)
  const eligible = exdEarned / denom
  return round2(eligible + exdSpentUsd)
}

export function buildLoyaltyRewardCalculation(input: {
  amountExd: string
  orderNum: string
  account: string
  earningRateValue: string
  boosterValue: string
  rewards?: TradingOrderRewardsEntry
}): LoyaltyRewardCalculation {
  const exdEarnedDisplay = round2(parseExdAbsolute(input.amountExd))
  const earningRatePercent = parseEarningRatePercent(input.earningRateValue)
  const { multiplier: boosterMultiplier, label: boosterLabel } = parseBoosterFromTierValue(
    input.boosterValue,
  )

  const exdSpentUsd =
    input.rewards?.cashbackFromExd != null
      ? round2(input.rewards.cashbackFromExd.exdDebited)
      : 0

  const useDemoEconomics =
    input.orderNum === DEMO_LOYALTY_CALC_ORDER_ID && exdSpentUsd === 0 && exdEarnedDisplay === 1.07

  const spreadUsd = useDemoEconomics
    ? DEMO_SPREAD_USD
    : spreadFromEarned(exdEarnedDisplay, earningRatePercent, boosterMultiplier, exdSpentUsd)

  const spentUsd = useDemoEconomics ? DEMO_EXD_SPENT_USD : exdSpentUsd
  const eligibleSpreadUsd = round2(Math.max(0, spreadUsd - spentUsd))
  const rate = earningRatePercent / 100
  const exdEarnedPrecise = eligibleSpreadUsd * rate * boosterMultiplier

  const spreadConversionNote = useDemoEconomics
    ? '342 THB → 10.02 USD'
    : spreadConversionNoteForUsd(spreadUsd)

  return {
    exdEarnedDisplay,
    exdEarnedPrecise,
    orderNum: input.orderNum,
    account: input.account,
    spreadUsd,
    exdSpentUsd: spentUsd,
    eligibleSpreadUsd,
    earningRatePercent,
    boosterMultiplier,
    boosterLabel: useDemoEconomics ? DEFAULT_BOOSTER_LABEL : boosterLabel,
    boosterTierValue: input.boosterValue.trim() || 'Ultimate · x2',
    spreadConversionNote,
  }
}

/** Figma 42413:33237 — `(10.49 - 0) × 5.34% × 2 = 1.12 EXD` */
export function formatCalculationFormulaLine(calc: LoyaltyRewardCalculation): string {
  const spread = calc.spreadUsd.toFixed(2)
  const spent = calc.exdSpentUsd.toFixed(2)
  const rate = `${calc.earningRatePercent}%`
  const mult = formatMultiplier(calc.boosterMultiplier)
  const result = calc.exdEarnedDisplay.toFixed(2)
  return `(${spread} - ${spent}) × ${rate} × ${mult} = ${result}\u00A0EXD`
}

export function formatSpreadUsdValue(spreadUsd: number): string {
  return `${spreadUsd.toFixed(2)} USD`
}

export function formatExdSpentValue(exdSpentUsd: number): string {
  return `${exdSpentUsd.toFixed(2)} EXD`
}

export function formatHeroExdAmount(exd: number): string {
  const sign = exd >= 0 ? '+' : ''
  return `${sign}${exd.toFixed(2)} EXD`
}
