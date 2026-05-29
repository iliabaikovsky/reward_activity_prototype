import type { AmountTone, RewardEventIcon } from './types'

export type TransactionRowModel = {
  icon: RewardEventIcon
  title: string
  amount: string
  amountTone?: AmountTone
  lines: string[]
  trailing: string
  badge?: string
}
