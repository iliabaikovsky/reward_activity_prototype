/**
 * Демо-временная шкала симулятора (см. docs/product/REWARD_LIFECYCLE.md).
 *
 * **Loyalty rewards (Upcoming):** агрегат pending EXD за **календарную неделю пн–вс**;
 * зачисление в Available rewards — в **среду после** этой недели (первая среда за воскресеньем периода).
 *
 * Якорь «сегодня» шага 1 — **17 Jun 2026** (среда),
 * внутри открытого периода Jun 15–21 → зачисление `on Jun 24`.
 *
 * **Накладка:** в понедельник–вторник недели активации прошлого периода в Upcoming
 * могут быть **две** строки Loyalty: прошлая неделя (зачисление в эту среду) и текущая
 * (с понедельника недели открытия периода → зачисление в следующую среду).
 */
export const DEMO_TODAY_ISO = '2026-06-17'

/** `simulatorTodayIso` по шагам 1…7 (от якоря шага 1). */
export const LIFECYCLE_STEP_TODAY_ISO = [
  '2026-06-17',
  '2026-06-17',
  '2026-06-24',
  '2026-06-25',
  '2026-06-26',
  '2026-06-28',
  '2026-07-18',
] as const

/** Предыдущий закрытый период (пн–вс) → активация в среду */
export const LOY_PERIOD_PREV_LABEL = 'Jun 8–14'
export const LOY_ACTIVATION_PREV_SHORT = 'Jun 17'

/** Текущий открытый период при «сегодня» 17 Jun (пн–вс) */
export const LOY_PERIOD_OPEN_LABEL = 'Jun 15–21'
export const LOY_ACTIVATION_OPEN_SHORT = 'Jun 24'

/** Следующий период после активации открытой недели */
export const LOY_PERIOD_NEXT_LABEL = 'Jun 22–28'
export const LOY_ACTIVATION_NEXT_SHORT = 'Jul 1'

/** Шаг 7 — открытый период при «сегодня» 18 Jul */
export const LOY_PERIOD_MATURE_LABEL = 'Jul 13–19'
export const LOY_ACTIVATION_MATURE_SHORT = 'Jul 22'

/** День сделки для cashback (модалка `For trading on`, моки). */
export const CB_PENDING_TRADE_DAY_SHORT = 'Jun 26'

/** Subtitle в list row для cashback (Upcoming / feed / preview). */
export const CB_LIST_SUBTITLE = 'For trading with EXD'

/** Вторая строка list row cashback — счёт зачисления (Upcoming drill, feed credited). */
export const CB_ACCOUNT_LIST_LINE = 'Account: #12345678'

/** Step 9 — три торговых счёта в локальных валютах (THB / JPY / INR). */
export const CB_ACCOUNT_THB_LINE = 'Account: #88112233'
export const CB_ACCOUNT_JPY_LINE = 'Account: #99223344'
export const CB_ACCOUNT_INR_LINE = 'Account: #77334455'

/** Subtitle в list row для EXD adjustment (feed / preview). */
export const ADJUSTMENT_LIST_SUBTITLE = 'Available rewards adjusted'

/** Subtitle в list row для loyalty activated (первая строка lines[]). */
export const LOYALTY_TO_AVAILABLE_SUBTITLE = 'To available'

/** Дата в колонке справа у Upcoming loyalty: `on Jun 24` */
export const upcomingLoyaltyDate = (activationShort: string) => `on ${activationShort}`

/** Поле «Available on» в деталке пачки (Upcoming) */
export const UPCOMING_ACTIVATION_DATETIME: Record<string, string> = {
  'on Jun 17': '17 Jun 2026, 18:43',
  'on Jun 24': '24 Jun 2026, 18:43',
  'on Jul 1': '1 Jul 2026, 18:43',
  'on Jul 22': '22 Jul 2026, 18:43',
}

/** Короткая подпись якорной даты прототипа для UI, напр. «17 Jun 2026». */
export function formatDemoTodayLabel(iso = DEMO_TODAY_ISO): string {
  return parseDemoToday(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
}

/** Парсит колонку даты Upcoming вида `on Jun 24` в локальную полночь. */
export function parseUpcomingPayoutDate(dateCol: string, year = 2026): Date | null {
  const trimmed = dateCol.replace(/^on\s+/i, '').trim()
  const parsed = new Date(`${trimmed}, ${year}`)
  if (Number.isNaN(parsed.getTime())) return null
  parsed.setHours(0, 0, 0, 0)
  return parsed
}

export type LoyaltyUpcomingSlot = {
  idSuffix: string
  periodLabel: string
  payoutDate: Date
}

function startOfDay(d: Date): Date {
  const x = new Date(d)
  x.setHours(0, 0, 0, 0)
  return x
}

/** Понедельник календарной недели, в которую попадает `d`. */
function mondayOfWeek(d: Date): Date {
  const x = startOfDay(d)
  const dow = x.getDay()
  const diff = dow === 0 ? -6 : 1 - dow
  x.setDate(x.getDate() + diff)
  return x
}

function formatPeriodLabel(start: Date, end: Date): string {
  const sameMonth = start.getMonth() === end.getMonth()
  const startStr = start.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  const endStr = sameMonth
    ? end.toLocaleDateString('en-US', { day: 'numeric' })
    : end.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  return `${startStr}–${endStr}`
}

/** Пн–вс недели заработка для зачисления в среду `activationWed`. */
function periodBoundsForActivation(activationWed: Date): { start: Date; end: Date } {
  const end = new Date(activationWed)
  end.setDate(activationWed.getDate() - 3)
  const start = new Date(end)
  start.setDate(end.getDate() - 6)
  return { start, end }
}

/** Якорь «сегодня» прототипа как Date (полночь локальная). */
export function parseDemoToday(iso = DEMO_TODAY_ISO): Date {
  const [y, m, d] = iso.split('-').map(Number)
  return startOfDay(new Date(y, m - 1, d))
}

/**
 * До двух pending Loyalty для Upcoming drill-in.
 * См. комментарий к DEMO_TODAY_ISO про накладку Mon–Tue.
 */
export function getLoyaltyUpcomingSlots(today: Date): LoyaltyUpcomingSlot[] {
  const t = startOfDay(today)
  const slots: LoyaltyUpcomingSlot[] = []
  const thisWeekMon = mondayOfWeek(t)
  const thisWeekWed = new Date(thisWeekMon)
  thisWeekWed.setDate(thisWeekMon.getDate() + 2)

  const isMondayOrTuesday = t.getDay() === 1 || t.getDay() === 2

  if (t < thisWeekWed && isMondayOrTuesday) {
    const { start, end } = periodBoundsForActivation(thisWeekWed)
    slots.push({
      idSuffix: 'loyalty-prev',
      periodLabel: formatPeriodLabel(start, end),
      payoutDate: new Date(thisWeekWed),
    })
  }

  const nextWeekMon = new Date(thisWeekMon)
  nextWeekMon.setDate(thisWeekMon.getDate() + 7)
  const currentActivation = new Date(nextWeekMon)
  currentActivation.setDate(nextWeekMon.getDate() + 2)

  const { start: periodStart, end: periodEnd } = periodBoundsForActivation(currentActivation)
  const periodStartWeekMon = mondayOfWeek(periodStart)

  if (t >= periodStartWeekMon && t < currentActivation) {
    slots.push({
      idSuffix: 'loyalty-current',
      periodLabel: formatPeriodLabel(periodStart, periodEnd),
      payoutDate: new Date(currentActivation),
    })
  }

  return slots
}
