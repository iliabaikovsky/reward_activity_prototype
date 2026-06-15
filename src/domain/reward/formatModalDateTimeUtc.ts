export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

const MONTH_TO_INDEX: Record<string, number> = Object.fromEntries(
  MONTH_SHORT.map((m, i) => [m, i]),
)

/** Upcoming When fields: `Mar 25, 2026, by 12:00 UTC`. */
export function formatUpcomingByNoonUtc(upcomingDateCol: string, defaultYear = 2026): string {
  const trimmed = upcomingDateCol.replace(/^on\s+/i, '').trim()
  const parsed = parseModalDateTimeLoose(`${trimmed}, ${defaultYear}, 12:00`, defaultYear)
  if (parsed) {
    const month = MONTH_SHORT[parsed.getUTCMonth()]
    const day = parsed.getUTCDate()
    const year = parsed.getUTCFullYear()
    return `${month} ${day}, ${year}, by 12:00 UTC`
  }
  return `${trimmed}, ${defaultYear}, by 12:00 UTC`
}

/** Normalize any modal datetime to Upcoming cutoff copy. */
export function formatAsUpcomingByNoon(input: string, defaultYear = 2026): string {
  const parsed = parseModalDateTimeLoose(input.replace(/\s+by 12:00 UTC$/i, ''), defaultYear)
  if (parsed) {
    const month = MONTH_SHORT[parsed.getUTCMonth()]
    const day = parsed.getUTCDate()
    const year = parsed.getUTCFullYear()
    return `${month} ${day}, ${year}, by 12:00 UTC`
  }
  return formatUpcomingByNoonUtc(input, defaultYear)
}

/** Modal datetime: `Mar 23, 2026, 08:00 UTC` (always UTC). */
export function formatModalDateTimeUtc(date: Date): string {
  const month = MONTH_SHORT[date.getUTCMonth()]
  const day = date.getUTCDate()
  const year = date.getUTCFullYear()
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')
  return `${month} ${day}, ${year}, ${hh}:${mm} UTC`
}

export function formatModalDateTimeUtcParts(
  year: number,
  monthIndex: number,
  day: number,
  hour: number,
  minute: number,
): string {
  return formatModalDateTimeUtc(new Date(Date.UTC(year, monthIndex, day, hour, minute)))
}

/** Parse demo / legacy strings and re-format with UTC suffix. */
export function parseModalDateTimeLoose(input: string, defaultYear = 2026): Date | null {
  const s = input.trim().replace(/\s+UTC$/i, '')

  let m = s.match(/^(\w{3})\s+(\d{1,2}),\s+(\d{4}),\s+(\d{2}):(\d{2})$/)
  if (m && MONTH_TO_INDEX[m[1]] != null) {
    return new Date(Date.UTC(+m[3], MONTH_TO_INDEX[m[1]], +m[2], +m[4], +m[5]))
  }

  m = s.match(/^(\d{1,2})\s+(\w{3})\s+(\d{4}),\s+(\d{2}):(\d{2})$/)
  if (m && MONTH_TO_INDEX[m[2]] != null) {
    return new Date(Date.UTC(+m[3], MONTH_TO_INDEX[m[2]], +m[1], +m[4], +m[5]))
  }

  m = s.match(/^(\w{3})\s+(\d{1,2}),\s+(\d{2}):(\d{2})$/)
  if (m && MONTH_TO_INDEX[m[1]] != null) {
    return new Date(Date.UTC(defaultYear, MONTH_TO_INDEX[m[1]], +m[2], +m[3], +m[4]))
  }

  return null
}

/** Modal date/period in `details[]`: `Mar 23, 2026` or `Mar 16–22, 2026` — no time, no UTC. */
export function formatModalDateLoose(input: string, defaultYear = 2026): string {
  const s = input.trim()
  if (!s || /\b\d{4}\b/.test(s)) return s

  const range = s.match(/^(\w{3})\s+(\d{1,2})([–-])(\d{1,2})$/)
  if (range && MONTH_TO_INDEX[range[1]] != null) {
    return `${range[1]} ${range[2]}${range[3]}${range[4]}, ${defaultYear}`
  }

  const day = s.match(/^(\w{3})\s+(\d{1,2})$/)
  if (day && MONTH_TO_INDEX[day[1]] != null) {
    return `${day[1]} ${day[2]}, ${defaultYear}`
  }

  return s
}

/** Re-format known datetime strings for modal `details[]` / order detail. */
export function formatModalDateTimeUtcLoose(input: string, defaultYear = 2026): string {
  const parsed = parseModalDateTimeLoose(input, defaultYear)
  if (parsed) return formatModalDateTimeUtc(parsed)
  return input
}

/** `18 Mar 2026` + `23:58` → modal datetime UTC. */
export function formatModalDateTimeUtcFromDateAndTime(
  dateLabel: string,
  time: string,
  defaultYear = 2026,
): string {
  const combined = `${dateLabel.replace(/,\s*$/, '')}, ${time}`
  const formatted = formatModalDateTimeUtcLoose(combined, defaultYear)
  if (formatted !== combined) return formatted
  return formatModalDateTimeUtcLoose(`${dateLabel}, ${defaultYear}, ${time}`, defaultYear)
}
