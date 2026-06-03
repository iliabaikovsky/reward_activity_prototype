import { parseExdAbsolute } from './parseExd'
import type { TradingOrderRewardsEntry } from './tradingOrder'

/** Linked trade_exd_rebate demo (REWARD_LIFECYCLE §7). */
export const DEMO_CASHBACK_CALC_ORDER_ID = '9100821'

export const REBATE_SHARE_PERCENT = 50

const DEMO_SPREAD_USD = 10
const DEMO_EXD_DEBITED = 5
const DEMO_CASHBACK_USD = 5

export type CashbackRebateCalculation = {
  exdDebited: number
  cashbackUsd: number
  spreadUsd: number
  /** Share of spread debited on this order (≤ maxSharePercent). */
  rebateSharePercent: number
  /** Program maximum share of spread (e.g. 50%). */
  maxSharePercent: number
  spreadConversionNote: string
  cashbackPending: boolean
  orderNum: string
}

/** Applied share % from debited EXD and spread; capped at program max. */
export function appliedSharePercent(
  exdDebited: number,
  spreadUsd: number,
  maxSharePercent: number,
): number {
  if (spreadUsd <= 0) return maxSharePercent
  const raw = (exdDebited / spreadUsd) * 100
  return Math.min(maxSharePercent, round2(raw))
}

function round2(n: number): number {
  return Math.round(n * 100) / 100
}

function spreadConversionNoteForUsd(spreadUsd: number): string {
  const thb = Math.round(spreadUsd * 32.6)
  return `${thb} THB → ${spreadUsd.toFixed(2)} USD`
}

/** spread ≈ EXD debited / (share% / 100) when share applied to full spread. */
function spreadFromExdDebited(exdDebited: number, sharePercent: number): number {
  const share = sharePercent / 100
  if (share <= 0) return exdDebited
  return round2(exdDebited / share)
}

export function buildCashbackRebateCalculation(input: {
  amountExd: string
  cashbackUsdLeg?: number
  orderNum: string
  packCredited?: boolean
  rewards?: TradingOrderRewardsEntry
}): CashbackRebateCalculation {
  const exdDebited = round2(parseExdAbsolute(input.amountExd))
  const cashbackUsd = round2(
    input.cashbackUsdLeg ??
      input.rewards?.cashbackFromExd?.amountUsd ??
      exdDebited,
  )

  const useDemo =
    input.orderNum === DEMO_CASHBACK_CALC_ORDER_ID &&
    exdDebited === DEMO_EXD_DEBITED &&
    cashbackUsd === DEMO_CASHBACK_USD

  const spreadUsd = useDemo
    ? DEMO_SPREAD_USD
    : spreadFromExdDebited(exdDebited, REBATE_SHARE_PERCENT)

  const spreadConversionNote = useDemo
    ? '342 THB → 10.00 USD'
    : spreadConversionNoteForUsd(spreadUsd)

  const maxSharePercent = REBATE_SHARE_PERCENT
  const rebateSharePercent = appliedSharePercent(exdDebited, spreadUsd, maxSharePercent)

  return {
    exdDebited,
    cashbackUsd,
    spreadUsd,
    rebateSharePercent,
    maxSharePercent,
    spreadConversionNote,
    cashbackPending: !input.packCredited,
    orderNum: input.orderNum,
  }
}

/** Figma-style: `10.00 × 50% = 5.00 EXD` */
export function formatCashbackFormulaLine(calc: CashbackRebateCalculation): string {
  const spread = calc.spreadUsd.toFixed(2)
  const share = `${calc.rebateSharePercent}%`
  const exd = calc.exdDebited.toFixed(2)
  return `${spread} × ${share} = ${exd}\u00A0EXD`
}

export function formatSpreadUsdValue(spreadUsd: number): string {
  return `${spreadUsd.toFixed(2)} USD`
}

export function formatExdDebitedValue(exd: number): string {
  return `${exd.toFixed(2)} EXD`
}

export function formatCashbackUsdValue(usd: number): string {
  return `${usd.toFixed(2)} USD`
}
