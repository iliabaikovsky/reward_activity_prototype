import { MONTH_SHORT, parseModalDateTimeLoose } from './formatModalDateTimeUtc'

/** List / order row datetime: `Mar 15, 16:06` — no year, no UTC. */
export function formatListDateTime(date: Date): string {
  const month = MONTH_SHORT[date.getUTCMonth()]
  const day = date.getUTCDate()
  const hh = String(date.getUTCHours()).padStart(2, '0')
  const mm = String(date.getUTCMinutes()).padStart(2, '0')
  return `${month} ${day}, ${hh}:${mm}`
}

/** Normalize any demo datetime string for list `trailing` / `order.date`. */
export function formatListDateTimeLoose(input: string, defaultYear = 2026): string {
  const parsed = parseModalDateTimeLoose(input, defaultYear)
  if (parsed) return formatListDateTime(parsed)
  return input.replace(/,\s*\d{4}(?=,|\s*$)/, '').replace(/\s+UTC$/i, '').trim()
}
