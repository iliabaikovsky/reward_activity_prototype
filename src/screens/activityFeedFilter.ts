import type { ActivityDatePreset, ActivityTypeFilter } from './activityFeedTypes'

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

function groupMatchesDatePreset(
  dateIso: string,
  preset: ActivityDatePreset,
  todayIso: string,
): boolean {
  if (preset === 'all') return true

  const d = parseDay(dateIso)
  const [ty, tm, td] = todayIso.split('-').map(Number)
  const today = new Date(Date.UTC(ty, tm - 1, td, 23, 59, 59))

  if (preset === 'thisMonth') {
    const [y, m] = dateIso.split('-').map(Number)
    return y === ty && m === tm
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
  todayIso: string,
): T[] {
  return groups
    .filter((g) => groupMatchesDatePreset(g.dateIso, datePreset, todayIso))
    .map((g) => ({
      ...g,
      items: g.items.filter((item) => typeFilter === 'all' || item.category === typeFilter),
    }))
    .filter((g) => g.items.length > 0)
}
