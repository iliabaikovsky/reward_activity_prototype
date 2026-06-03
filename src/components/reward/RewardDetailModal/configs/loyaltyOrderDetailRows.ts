import type { DetailRow } from '../../../domain/reward/types'
import { PACK_DEFAULT_ACCOUNT } from './packDetailRows'

export const LOYALTY_LIST_BOOSTER_BADGE = 'x2'
const LOYALTY_BOOSTER_TIER = 'Ultimate · x2'
const EARNING_RATE_VALUE = '5.34%'

/** Loyalty order detail: When → To account → Why → Other */
export function loyaltyOrderDetailRows(
  mode: 'upcoming' | 'activated',
  whenValue: string,
  orderNum: string,
): DetailRow[] {
  const whenLabel = mode === 'upcoming' ? 'Earned on' : 'Posted on'

  return [
    { label: whenLabel, value: whenValue },
    { label: 'Account', value: PACK_DEFAULT_ACCOUNT },
    { label: 'Order', value: orderNum, chevron: true },
    { label: 'Booster', value: LOYALTY_BOOSTER_TIER, valueDisplay: 'boosterTier' },
    { label: 'Earning rate', value: EARNING_RATE_VALUE, chevron: true },
  ]
}
