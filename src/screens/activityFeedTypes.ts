/** Группы для фильтра «тип» в Activity feed */
export type ActivityTypeFilter = 'all' | 'rewards' | 'cashback' | 'transfers' | 'others'

/** Пресеты даты (нативный action sheet) */
export type ActivityDatePreset = 'all' | 'last7' | 'last30' | 'thisMonth'

export const TYPE_FILTER_LABELS: Record<ActivityTypeFilter, string> = {
  all: 'All types',
  rewards: 'Rewards',
  cashback: 'Cashback',
  transfers: 'Transfers',
  others: 'Others',
}

export const DATE_PRESET_LABELS: Record<ActivityDatePreset, string> = {
  all: 'All time',
  last7: 'Last 7 days',
  last30: 'Last 30 days',
  thisMonth: 'March 2026',
}

/** «Сегодня» для относительных диапазонов (симулятор, см. demoTimeline.ts) */
export { DEMO_TODAY_ISO as ACTIVITY_FEED_TODAY_ISO } from '../rewardLifecycle/demoTimeline'
