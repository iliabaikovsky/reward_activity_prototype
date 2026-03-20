/**
 * Демо-временная шкала симулятора (см. REWARD_LIFECYCLE.md).
 *
 * **Loyalty rewards:** период начисления **среда–воскресенье** (включительно),
 * активация в **Available rewards** — в **среду следующей недели** после окончания периода.
 *
 * Якорь «сегодня» для UI и фильтров Activity feed — **20 Mar 2026** (пятница),
 * внутри открытого периода Mar 18–22.
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
  'on Mar 25': '25 Mar 2026, 18:43',
  'on Apr 1': '1 Apr 2026, 18:43',
}
