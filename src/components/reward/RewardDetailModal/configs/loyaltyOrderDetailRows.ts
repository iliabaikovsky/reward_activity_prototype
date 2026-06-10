import type { DetailRow } from '../../../domain/reward/types'
import { formatAsUpcomingByNoon } from '../../../../domain/reward/formatModalDateTimeUtc'
import { PACK_DEFAULT_ACCOUNT } from './packDetailRows'

export const LOYALTY_LIST_BOOSTER_BADGE = 'x2'
const LOYALTY_BOOSTER_TIER = 'Ultimate · x2'
export const EARNING_RATE_VALUE = '5.34%'

/** Loyalty order detail: When → Account → Order → Booster (no Calculation / Earning rate in stripped UX). */
export function loyaltyOrderDetailRows(
  mode: 'upcoming' | 'activated',
  whenValue: string,
  orderNum: string,
): DetailRow[] {
  const whenLabel = mode === 'upcoming' ? 'Earned on' : 'Posted on'
  const displayWhen = mode === 'upcoming' ? formatAsUpcomingByNoon(whenValue) : whenValue

  return [
    { label: whenLabel, value: displayWhen },
    { label: 'Account', value: PACK_DEFAULT_ACCOUNT },
    { label: 'Order', value: orderNum },
    { label: 'Booster', value: LOYALTY_BOOSTER_TIER, valueDisplay: 'boosterTier' },
  ]
}
