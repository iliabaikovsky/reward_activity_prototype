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
  /** Шеврон: навигация (order, calculation details). */
  chevron?: boolean
  /** Info icon: earning rate explainer (Figma 42413:32765). */
  infoIcon?: boolean
  /** `boosterTier` — info chip; `navDetail` — trailing Details + chevron (Figma). */
  valueDisplay?: 'text' | 'boosterTier' | 'navDetail'
}
