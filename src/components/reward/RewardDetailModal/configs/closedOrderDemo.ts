/** Статичные поля closed order (Figma 42413:31780) — не зависят от Rewards-логики. */
export type ClosedOrderField = {
  label: string
  value: string
  tone?: 'secondary' | 'buy' | 'success'
  chevron?: boolean
}

export type ClosedOrderSummary = {
  symbol: string
  pnl: string
  pnlTone: 'success' | 'negative'
  side: string
  lot: string
  openPrice: string
  closePrice: string
}

const DEFAULT_SUMMARY: ClosedOrderSummary = {
  symbol: 'EUR/USD',
  pnl: '+0.41 USD',
  pnlTone: 'success',
  side: 'Buy',
  lot: '0.01 lot',
  openPrice: '1.06553',
  closePrice: '1.06634',
}

export function closedOrderSummaryFor(orderNum: string): ClosedOrderSummary {
  const n = parseInt(orderNum, 10)
  if (!Number.isFinite(n)) return DEFAULT_SUMMARY
  const variant = n % 3
  if (variant === 1) {
    return { ...DEFAULT_SUMMARY, pnl: '+0.41 USD', pnlTone: 'success' }
  }
  if (variant === 2) {
    return {
      symbol: 'XAU/USD',
      pnl: '-1.12 USD',
      pnlTone: 'negative',
      side: 'Sell',
      lot: '0.02 lot',
      openPrice: '2145.10',
      closePrice: '2144.54',
    }
  }
  return {
    symbol: 'GBP/USD',
    pnl: '+0.18 USD',
    pnlTone: 'success',
    side: 'Buy',
    lot: '0.01 lot',
    openPrice: '1.26410',
    closePrice: '1.26428',
  }
}

export function closedOrderDetailFields(): ClosedOrderField[] {
  return [
    { label: 'Open price', value: '1.06553', tone: 'secondary' },
    { label: 'Close price', value: '1.06549', tone: 'secondary' },
    { label: 'Open time', value: '12/07/2023, 6:43 PM', tone: 'secondary' },
    { label: 'Close time', value: '12/07/2023, 6:43 PM', tone: 'secondary' },
    { label: 'Closed by', value: 'User', tone: 'secondary' },
    { label: 'Swap', value: '0 USD', tone: 'secondary' },
    { label: 'Commission', value: '0 USD', tone: 'secondary' },
    { label: 'Stop loss', value: '1.3155', tone: 'secondary' },
    { label: 'Take profit', value: '1.3654', tone: 'secondary' },
    { label: 'Chart', value: 'View chart', chevron: true },
  ]
}
