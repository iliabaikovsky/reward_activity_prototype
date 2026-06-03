/** Иконки событий в списках и modal hero (Tabler). */
export type RewardEventIcon = 'dollar' | 'crown' | 'gift' | 'transfer' | 'crownOff'

/** Тон суммы в Activity feed. */
export type AmountTone = 'positive' | 'neutral' | 'negative'

/** Иконка строки в списке Orders (modal). */
export type OrderRowIcon = 'crown' | 'exchange'

/** Тон status chip в modal. */
export type ChipTone = 'warning' | 'success' | 'neutral' | 'negative'

/** Иконка hero в modal (alias для RewardEventIcon). */
export type HeroIcon = RewardEventIcon

export type DetailRow = {
  label: string
  value: string
  /** Шеврон: будущая навигация (order drill-down, earning rate info). */
  chevron?: boolean
  /** `boosterTier` — info chip (Figma Booster cell). */
  valueDisplay?: 'text' | 'boosterTier'
}
