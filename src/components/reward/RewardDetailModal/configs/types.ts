import type { ChipTone, DetailRow, HeroIcon, OrderRowIcon } from '../../../../domain/reward/types'

/** Строка в списке Orders + отдельная деталька по клику */
export type OrderInPack = {
  id: string
  listIcon: OrderRowIcon
  title: string
  /** Figma 41788:19744 — multiplier chip у title (loyalty order list). */
  listBoosterBadge?: string
  amount: string
  amountClass?: 'negative'
  meta: string[]
  date: string
  /** USD leg для registry (cashback order); совпадает с hero pack split. */
  cashbackUsdLeg?: number
  /** Upcoming: USD list + EXD in detail; Credited: EXD debit list (legacy). */
  legMode?: 'upcoming' | 'credited'
  detail: {
    navTitle: string
    chip: { text: string; tone: ChipTone }
    heroIcon: HeroIcon
    amount: string
    amountTone?: 'negative'
    details: DetailRow[]
  }
}

export type PackConfig = {
  navTitle: string
  chip: { text: string; tone: ChipTone }
  heroIcon: HeroIcon
  amount: string
  amountTone?: 'negative'
  details: DetailRow[]
  orders: OrderInPack[]
}

export type SimpleCelebration = {
  message: string
  imageAlt: string
}

export type SimpleConfig = {
  navTitle: string
  chip: { text: string; tone: ChipTone }
  heroIcon: HeroIcon
  amount: string
  amountTone?: 'negative'
  details: DetailRow[]
  /** Birthday gift: message + 16:9 banner below metadata rows. */
  celebration?: SimpleCelebration
  orders?: undefined
}

export type PackVariantKey =
  | 'loyalty-upcoming'
  | 'loyalty-activated'
  | 'cashback-upcoming'
  | 'cashback-activated'
  | 'cashback-activated-jan12'

export type SimpleVariantKey = 'transfer-exd' | 'promo-gift' | 'exd-adjustment'
