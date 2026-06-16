import type { LifecycleStep } from './lifecycleSteps'
import { LIFECYCLE_STEPS } from './lifecycleSteps'

const EMPTY_LIFE: LifecycleStep = LIFECYCLE_STEPS[0]
const TRADE_DEMO_LIFE: LifecycleStep =
  LIFECYCLE_STEPS.find((s) => s.id === 'mature_trader_tuesday') ?? LIFECYCLE_STEPS[LIFECYCLE_STEPS.length - 1]

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

/** Типичный зрелый день: T+60, часть EXD зачислена, USD on-hold снят после выбора счёта, ближайшая выплата завтра. */
const R_AFTER_MONTH_TODAY: RebateDemoState = {
  pendingCount: 60,
  pendingExd: '+184.20 EXD',
  pendingUsd: '+192.45 USD',
  nextPayoutDate: 'Tomorrow',
  paidExdCount: 5,
  paidExdAmount: '+20.98 EXD',
  onHoldUsdCount: 5,
  onHoldUsdAmount: '+21.40 USD',
  totalWithOnHoldUsd: '+213.85 USD',
  showAccountAlert: false,
  usdAccountSelected: true,
}

/**
 * Два состояния прототипа spread rebate: пустой экран и зрелый день после месяца торговли.
 */
export const REBATE_SIMULATOR_STEPS: RebateSimulatorStep[] = [
  {
    id: 'rebate_0_zero',
    label: 'Ноль',
    lifecycle: EMPTY_LIFE,
    rebate: R_NONE,
  },
  {
    id: 'rebate_1_after_month_today',
    label: 'После месяца торговли (текущий день)',
    lifecycle: cloneLife({
      id: 'rebate_after_month',
      label: 'После месяца торговли (текущий день)',
      docRef: 'Rebate simulator',
    }),
    rebate: R_AFTER_MONTH_TODAY,
  },
]

/** Старт на «после месяца», чтобы сразу видеть полный прототип. */
export const REBATE_SIMULATOR_DEFAULT_INDEX = 1

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
