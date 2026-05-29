import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import type { AmountTone, RewardEventIcon } from '../domain/reward/types'
import type { ActivityTypeFilter } from '../screens/activityFeedTypes'

/** Элемент ленты Activity feed (полный экран и фильтры) */
export type ActivityFeedItem = {
  id: string
  title: string
  amount: string
  amountTone: AmountTone
  lines: string[]
  time: string
  icon: RewardEventIcon
  rewardModal: RewardModalVariant
  category: ActivityTypeFilter
}

export type ActivityFeedGroup = {
  dateLabel: string
  dateIso: string
  summary: string
  items: ActivityFeedItem[]
}

export type { AmountTone, RewardEventIcon }
