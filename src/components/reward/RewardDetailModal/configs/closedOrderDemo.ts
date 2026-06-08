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

/** Demo order linked to trade_exd_rebate (symulator step 7). */
const TRADE_EXD_REBATE_ORDER = '9100821'

export function closedOrderSummaryFor(orderNum: string): ClosedOrderSummary {
  if (orderNum === TRADE_EXD_REBATE_ORDER) {
    return {
      symbol: 'XAU/USD',
      pnl: '+0.30 USD',
      pnlTone: 'success',
      side: 'Buy',
      lot: '0.01 lot',
      openPrice: '4,669.735',
      closePrice: '4,670.043',
    }
  }

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

export function closedOrderDetailFields(orderNum?: string): ClosedOrderField[] {
  const summary = orderNum ? closedOrderSummaryFor(orderNum) : DEFAULT_SUMMARY
  const isXauDemo = orderNum === TRADE_EXD_REBATE_ORDER

  return [
    { label: 'Open price', value: summary.openPrice, tone: 'secondary' },
    { label: 'Close price', value: summary.closePrice, tone: 'secondary' },
    {
      label: 'P/L',
      value: summary.pnl.replace(/^\+/, ''),
      tone: summary.pnlTone === 'success' ? 'success' : 'secondary',
    },
    {
      label: 'Open time',
      value: isXauDemo ? '11.05.2026 11:41:55' : '12/07/2023, 6:43 PM',
      tone: 'secondary',
    },
    {
      label: 'Close time',
      value: isXauDemo ? '11.05.2026 11:42:05' : '12/07/2023, 6:43 PM',
      tone: 'secondary',
    },
    { label: 'Closed by', value: 'User', tone: 'secondary' },
    { label: 'Swap', value: '+0.00 USD', tone: 'secondary' },
    { label: 'Commission', value: '+0.00 USD', tone: 'secondary' },
    { label: 'Stop loss', value: '0.000', tone: 'secondary' },
    { label: 'Take profit', value: '0.000', tone: 'secondary' },
    { label: 'Chart', value: 'View chart', chevron: true },
  ]
}
