export type {
  OrderInPack,
  PackConfig,
  PackVariantKey,
  SimpleConfig,
  SimpleVariantKey,
} from './types'
export { PACK_CONFIG } from './packConfigs'
export { SIMPLE_CONFIG } from './simpleConfigs'
export {
  ORDERS_DEMO_TOTAL,
  ORDERS_PREVIEW_COUNT,
  expandOrdersForDemo,
} from './orderDemo'

import type { RewardModalVariant } from '../../rewardModalTypes'
import { PACK_CONFIG } from './packConfigs'

export function isPackVariant(v: RewardModalVariant): v is keyof typeof PACK_CONFIG {
  return (
    v === 'loyalty-upcoming' ||
    v === 'loyalty-activated' ||
    v === 'cashback-upcoming' ||
    v === 'cashback-activated' ||
    v === 'cashback-activated-jan12'
  )
}

export function isUpcomingPackVariant(v: RewardModalVariant): boolean {
  return v === 'loyalty-upcoming' || v === 'cashback-upcoming'
}
