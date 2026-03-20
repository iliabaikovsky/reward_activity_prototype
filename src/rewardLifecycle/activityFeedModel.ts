import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import type { ActivityTypeFilter } from '../screens/activityFeedTypes'

export type FeedAmountTone = 'positive' | 'neutral' | 'negative'

/** Элемент ленты Activity feed (полный экран и фильтры) */
export type ActivityFeedItem = {
  id: string
  title: string
  amount: string
  amountTone: FeedAmountTone
  lines: string[]
  time: string
  icon: 'dollar' | 'crown' | 'gift' | 'transfer' | 'crownOff'
  rewardModal: RewardModalVariant
  category: ActivityTypeFilter
}

export type ActivityFeedGroup = {
  dateLabel: string
  dateIso: string
  summary: string
  items: ActivityFeedItem[]
}
