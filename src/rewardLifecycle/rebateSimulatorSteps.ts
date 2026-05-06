import type { LifecycleStep } from './lifecycleSteps'
import { LIFECYCLE_STEPS } from './lifecycleSteps'

const EMPTY_LIFE: LifecycleStep = LIFECYCLE_STEPS[0]
const TRADE_DEMO_LIFE: LifecycleStep = LIFECYCLE_STEPS[6]

function cloneLife(overrides: Partial<LifecycleStep>): LifecycleStep {
  const base = TRADE_DEMO_LIFE
  return {
    ...base,
    ...overrides,
    upcoming: overrides.upcoming ?? base.upcoming,
    activityPreview: overrides.activityPreview ?? base.activityPreview,
    feedGroups: overrides.feedGroups ?? base.feedGroups,
  }
}

/** Демо-числа для виджетов Spread rebate (V1–V4). */
export type RebateDemoState = {
  pendingCount: number
  pendingExd: string
  pendingUsd: string
  nextPayoutDate: string
  paidExdCount: number
  paidExdAmount: string
  onHoldUsdCount: number
  onHoldUsdAmount: string
  totalWithOnHoldUsd: string
  /** Жёлтый alert (V2/V4) и предупреждение USD в V3. */
  showAccountAlert: boolean
  /** Блок выбора счёта в V4: выбран ли USD destination. */
  usdAccountSelected: boolean
}

export type RebateSimulatorStep = {
  id: string
  label: string
  lifecycle: LifecycleStep
  rebate: RebateDemoState
}

const R_NONE: RebateDemoState = {
  pendingCount: 0,
  pendingExd: '+0.00 EXD',
  pendingUsd: '+0.00 USD',
  nextPayoutDate: '—',
  paidExdCount: 0,
  paidExdAmount: '+0.00 EXD',
  onHoldUsdCount: 0,
  onHoldUsdAmount: '+0.00 USD',
  totalWithOnHoldUsd: '+0.00 USD',
  showAccountAlert: false,
  usdAccountSelected: false,
}

const R_30: RebateDemoState = {
  pendingCount: 30,
  pendingExd: '+92.10 EXD',
  pendingUsd: '+96.50 USD',
  nextPayoutDate: '7 May 2026',
  paidExdCount: 0,
  paidExdAmount: '+0.00 EXD',
  onHoldUsdCount: 0,
  onHoldUsdAmount: '+0.00 USD',
  totalWithOnHoldUsd: '+96.50 USD',
  showAccountAlert: false,
  usdAccountSelected: false,
}

const R_MATURE_NO_ACCT: RebateDemoState = {
  pendingCount: 60,
  pendingExd: '+184.20 EXD',
  pendingUsd: '+192.45 USD',
  nextPayoutDate: '7 May 2026',
  paidExdCount: 5,
  paidExdAmount: '+20.98 EXD',
  onHoldUsdCount: 5,
  onHoldUsdAmount: '+21.40 USD',
  totalWithOnHoldUsd: '+213.85 USD',
  showAccountAlert: true,
  usdAccountSelected: false,
}

const R_MATURE_ACCT_TOMORROW: RebateDemoState = {
  ...R_MATURE_NO_ACCT,
  nextPayoutDate: 'Tomorrow',
  showAccountAlert: false,
  usdAccountSelected: true,
}

const R_NEW_DAY_30: RebateDemoState = {
  pendingCount: 30,
  pendingExd: '+111.50 EXD',
  pendingUsd: '+118.20 USD',
  nextPayoutDate: 'Tomorrow',
  paidExdCount: 3,
  paidExdAmount: '+14.60 EXD',
  onHoldUsdCount: 0,
  onHoldUsdAmount: '+0.00 USD',
  totalWithOnHoldUsd: '+118.20 USD',
  showAccountAlert: false,
  usdAccountSelected: true,
}

/**
 * Пять этапов прототипа spread rebate (вместо старого жизненного цикла на 10 шагов).
 */
export const REBATE_SIMULATOR_STEPS: RebateSimulatorStep[] = [
  {
    id: 'rebate_0_empty',
    label: 'Ничего нет',
    lifecycle: EMPTY_LIFE,
    rebate: R_NONE,
  },
  {
    id: 'rebate_1_future_30',
    label: 'Будущие выплаты (~30)',
    lifecycle: cloneLife({
      id: 'rebate_demo_wallet',
      label: 'Будущие выплаты (~30)',
      docRef: 'Rebate simulator',
      availableRewardsExd: '0.00 EXD',
      tradingWalletLabel: 'Account #12345678',
      tradingWalletValue: '47.80 EXD',
      tradingWalletMuted: false,
      tierEarnedExdTowardGoal: 52.8,
    }),
    rebate: R_30,
  },
  {
    id: 'rebate_2_mature_no_account',
    label: 'T+60: первые выплаты, нет счёта + alert',
    lifecycle: cloneLife({
      id: 'rebate_demo_mature',
      label: 'T+60: первые выплаты, нет счёта + alert',
      docRef: 'Rebate simulator',
    }),
    rebate: R_MATURE_NO_ACCT,
  },
  {
    id: 'rebate_3_account_tomorrow',
    label: 'Счёт выбран, ближайшая выплата завтра',
    lifecycle: cloneLife({
      id: 'rebate_demo_acct',
      label: 'Счёт выбран, ближайшая выплата завтра',
      docRef: 'Rebate simulator',
    }),
    rebate: R_MATURE_ACCT_TOMORROW,
  },
  {
    id: 'rebate_4_new_day',
    label: 'Новый день выплат: те же слоты, другая агрегация',
    lifecycle: cloneLife({
      id: 'rebate_demo_roll',
      label: 'Новый день выплат: те же слоты, другая агрегация',
      docRef: 'Rebate simulator',
    }),
    rebate: R_NEW_DAY_30,
  },
]

/** Стартовый шаг — как «сделка + cashback pending» (зрелый ворон, без счёта, alert). */
export const REBATE_SIMULATOR_DEFAULT_INDEX = 2

/** Абсолютное значение суммы из строки вида "+96.50 USD" или "+0.00 EXD". */
export function parseSignedAmount(amount: string): number {
  const m = amount.replace(/,/g, '').match(/[+-]?[\d.]+/)
  if (!m) return 0
  const n = parseFloat(m[0])
  return Number.isFinite(n) ? Math.abs(n) : 0
}

/** Есть ли ненулевые будущие выплаты по spread rebate (для строк в Upcoming). */
export function hasRebatePendingPayouts(rebate: RebateDemoState): boolean {
  const count = Math.floor(Number(rebate.pendingCount))
  if (!Number.isFinite(count) || count < 1) return false
  const usd = parseSignedAmount(rebate.pendingUsd)
  const exd = parseSignedAmount(rebate.pendingExd)
  if (usd <= 0 && exd <= 0) return false
  return true
}

/** Суммы EXD уже зачисленные по зрелым выплатам (для строки в списке). */
export function hasRebatePaidExd(rebate: RebateDemoState): boolean {
  if (rebate.paidExdCount <= 0) return false
  return parseSignedAmount(rebate.paidExdAmount) > 0
}

/** Средний «кусок» следующей выплаты для копирайта в списках (V1/V2). */
export function rebateNextChunk(
  totalLabel: string,
  count: number,
  currency: 'USD' | 'EXD',
): string {
  const m = totalLabel.replace(/,/g, '').match(/[+-]?[\d.]+/)
  const n = m ? parseFloat(m[0]) : 0
  const per = count > 0 ? Math.abs(n) / count : 0
  return `+${per.toFixed(2)} ${currency}`
}
