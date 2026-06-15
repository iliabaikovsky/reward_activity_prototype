import { isDateIsoInRange, type DateRangeFilter } from '../domain/reward/dateRangeFilter'
import type { ActivityTypeFilter } from './activityFeedTypes'

export type FeedItemForFilter = {
  category: ActivityTypeFilter
}

export type FeedGroupForFilter = {
  dateIso: string
  items: FeedItemForFilter[]
}

export function filterFeedGroups<T extends FeedGroupForFilter & { items: Array<FeedItemForFilter & unknown> }>(
  groups: T[],
  typeFilter: ActivityTypeFilter,
  dateRange: DateRangeFilter,
): T[] {
  return groups
    .filter((g) => isDateIsoInRange(g.dateIso, dateRange))
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => typeFilter === 'all' || item.category === typeFilter),
    }))
    .filter((g) => g.items.length > 0)
}
