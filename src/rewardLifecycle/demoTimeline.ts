/**
 * Демо-временная шкала симулятора (см. REWARD_LIFECYCLE.md).
 *
 * **Loyalty rewards:** период начисления **среда–воскресенье** (включительно),
 * активация в **Available rewards** — в **среду следующей недели** после окончания периода.
 *
 * Якорь «сегодня» для UI и фильтров Activity feed — **20 Mar 2026** (пятница),
 * внутри открытого периода Mar 18–22.
 *
 * **Накладка:** в понедельник–вторник недели активации прошлого периода в Upcoming
 * могут быть **две** строки Loyalty: прошлая неделя (зачисление в эту среду) и текущая
 * (с понедельника недели открытия периода → зачисление в следующую среду).
 */
export const DEMO_TODAY_ISO = '2026-03-20'

/** Предыдущий закрытый период (ср–вс) → активация в следующую среду */
export const LOY_PERIOD_PREV_LABEL = 'Mar 11–15'
export const LOY_ACTIVATION_PREV_SHORT = 'Mar 18'

/** Текущий открытый период при «сегодня» 20 Mar (ср–вс) */
export const LOY_PERIOD_OPEN_LABEL = 'Mar 18–22'
export const LOY_ACTIVATION_OPEN_SHORT = 'Mar 25'

/** Следующий период после активации открытой недели */
export const LOY_PERIOD_NEXT_LABEL = 'Mar 25–29'
export const LOY_ACTIVATION_NEXT_SHORT = 'Apr 1'

/** День сделки для Cashback pending в Upcoming: одна строка «For trading on …» */
export const CB_PENDING_TRADE_DAY_SHORT = 'Mar 22'

/** Дата в колонке справа у Upcoming loyalty: `on Mar 25` */
export const upcomingLoyaltyDate = (activationShort: string) => `on ${activationShort}`

/** Поле «Become available on» в деталке пачки (Upcoming) */
export const UPCOMING_ACTIVATION_DATETIME: Record<string, string> = {
  'on Mar 18': '18 Mar 2026, 18:43',
  'on Mar 25': '25 Mar 2026, 18:43',
  'on Apr 1': '1 Apr 2026, 18:43',
}

/** Короткая подпись якорной даты прототипа для UI, напр. «20 Mar 2026». */
export function formatDemoTodayLabel(iso = DEMO_TODAY_ISO): string {
  return parseDemoToday(iso).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  })
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

function periodBoundsForActivation(activationWed: Date): { start: Date; end: Date } {
  const start = new Date(activationWed)
  start.setDate(activationWed.getDate() - 7)
  const end = new Date(activationWed)
  end.setDate(activationWed.getDate() - 3)
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
