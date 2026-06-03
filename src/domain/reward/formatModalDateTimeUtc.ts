export const MONTH_SHORT = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'] as const

const MONTH_TO_INDEX: Record<string, number> = Object.fromEntries(
  MONTH_SHORT.map((m, i) => [m, i]),
)

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
