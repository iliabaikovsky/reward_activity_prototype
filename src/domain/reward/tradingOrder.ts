/** Прототип: 1 EXD списания ≈ USD для cashback leg (см. buildLoyaltyModalPack). */
export const EXD_TO_USD_CASHBACK_RATE = 1.185

export type TradingOrderRewardsEntry = {
  exdEarned?: { amountExd: number; pending: boolean }
  cashbackFromExd?: { amountUsd: number; exdDebited: number; pending: boolean }
}

export type TradingOrderRegistry = Record<string, TradingOrderRewardsEntry>

export function formatRewardsExd(n: number): string {
  return `${n.toFixed(2)} EXD`
}

export function formatRewardsUsd(n: number): string {
  return `${n.toFixed(2)} USD`
}
