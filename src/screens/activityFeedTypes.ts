/** Группы для фильтра «тип» в Activity feed */
export type ActivityTypeFilter = 'all' | 'rewards' | 'cashback' | 'transfers' | 'others'

export const TYPE_FILTER_LABELS: Record<ActivityTypeFilter, string> = {
  all: 'All types',
  rewards: 'Rewards',
  cashback: 'Cashback',
  transfers: 'Transfers',
  others: 'Others',
}

export {
  ALL_TIME_DATE_RANGE,
  type DateRangeFilter,
} from '../domain/reward/dateRangeFilter'

/** «Сегодня» для относительных диапазонов (симулятор, см. demoTimeline.ts) */
export { DEMO_TODAY_ISO as ACTIVITY_FEED_TODAY_ISO } from '../rewardLifecycle/demoTimeline'
