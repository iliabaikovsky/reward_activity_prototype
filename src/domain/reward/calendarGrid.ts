export type CalendarDayCell = {
  year: number
  month: number
  day: number
  iso: string
  inCurrentMonth: boolean
}

const WEEKDAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'] as const

export function weekdayLabels(): readonly string[] {
  return WEEKDAY_LABELS
}

export function monthYearLabel(year: number, month: number): string {
  return new Date(year, month, 1).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })
}

function toIso(year: number, month: number, day: number): string {
  return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`
}

function daysInMonth(year: number, month: number): number {
  return new Date(year, month + 1, 0).getDate()
}

/** Monday-first grid for one month (includes leading/trailing days). */
export function buildMonthGrid(year: number, month: number): CalendarDayCell[][] {
  const first = new Date(year, month, 1)
  const mondayIndex = (first.getDay() + 6) % 7
  const totalDays = daysInMonth(year, month)

  const cells: CalendarDayCell[] = []

  const prevMonth = month === 0 ? 11 : month - 1
  const prevYear = month === 0 ? year - 1 : year
  const prevDays = daysInMonth(prevYear, prevMonth)

  for (let i = mondayIndex - 1; i >= 0; i--) {
    const day = prevDays - i
    cells.push({
      year: prevYear,
      month: prevMonth,
      day,
      iso: toIso(prevYear, prevMonth, day),
      inCurrentMonth: false,
    })
  }

  for (let day = 1; day <= totalDays; day++) {
    cells.push({
      year,
      month,
      day,
      iso: toIso(year, month, day),
      inCurrentMonth: true,
    })
  }

  const nextMonth = month === 11 ? 0 : month + 1
  const nextYear = month === 11 ? year + 1 : year
  let trailing = 1
  while (cells.length % 7 !== 0) {
    cells.push({
      year: nextYear,
      month: nextMonth,
      day: trailing,
      iso: toIso(nextYear, nextMonth, trailing),
      inCurrentMonth: false,
    })
    trailing++
  }

  const weeks: CalendarDayCell[][] = []
  for (let i = 0; i < cells.length; i += 7) {
    weeks.push(cells.slice(i, i + 7))
  }
  return weeks
}

export function parseIsoToMonth(iso: string): { year: number; month: number } {
  const [y, m] = iso.split('-').map(Number)
  return { year: y, month: m - 1 }
}

export function compareIso(a: string, b: string): number {
  return a < b ? -1 : a > b ? 1 : 0
}
