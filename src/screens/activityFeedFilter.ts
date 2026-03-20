import type { ActivityDatePreset, ActivityTypeFilter } from './activityFeedTypes'
import { ACTIVITY_FEED_TODAY_ISO } from './activityFeedTypes'

export type FeedItemForFilter = {
  category: ActivityTypeFilter
}

export type FeedGroupForFilter = {
  dateIso: string
  items: FeedItemForFilter[]
}

function parseDay(iso: string): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return new Date(Date.UTC(y, m - 1, d, 12, 0, 0))
}

function groupMatchesDatePreset(dateIso: string, preset: ActivityDatePreset): boolean {
  if (preset === 'all') return true

  const d = parseDay(dateIso)
  const [ty, tm, td] = ACTIVITY_FEED_TODAY_ISO.split('-').map(Number)
  const today = new Date(Date.UTC(ty, tm - 1, td, 23, 59, 59))

  if (preset === 'thisMonth') {
    return d.getUTCFullYear() === 2026 && d.getUTCMonth() === 2
  }

  const days = preset === 'last7' ? 7 : 30
  const cutoff = new Date(today)
  cutoff.setUTCDate(cutoff.getUTCDate() - days)
  cutoff.setUTCHours(0, 0, 0, 0)
  return d >= cutoff && d <= today
}

export function filterFeedGroups<T extends FeedGroupForFilter & { items: Array<FeedItemForFilter & unknown> }>(
  groups: T[],
  typeFilter: ActivityTypeFilter,
  datePreset: ActivityDatePreset,
): T[] {
  return groups
    .filter((g) => groupMatchesDatePreset(g.dateIso, datePreset))
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => typeFilter === 'all' || item.category === typeFilter),
    }))
    .filter((g) => g.items.length > 0)
}
