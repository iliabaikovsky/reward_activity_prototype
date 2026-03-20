/** Варианты bottom sheet: единый шаблон (герой + чип + строки деталей), без списка ордеров */
export type RewardModalVariant =
  | 'loyalty-upcoming'
  | 'loyalty-activated'
  | 'cashback-upcoming'
  | 'cashback-activated'
  /** Cashback за другую дату (вторая строка в ленте) */
  | 'cashback-activated-jan12'
  | 'transfer-exd'
  | 'promo-gift'
  | 'exd-adjustment'
