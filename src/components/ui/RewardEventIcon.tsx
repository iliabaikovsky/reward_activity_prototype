import {
  IconArrowsExchange,
  IconArrowsRightLeft,
  IconCrown,
  IconCrownOff,
  IconCurrencyDollar,
  IconGift,
} from '@tabler/icons-react'
import type { OrderRowIcon, RewardEventIcon as RewardEventIconKind } from '../../domain/reward/types'

type Props = {
  kind: RewardEventIconKind
  size?: number
  stroke?: number
  className?: string
}

export function RewardEventIcon({ kind, size = 24, stroke = 1.75, className }: Props) {
  const common = { size, stroke, 'aria-hidden': true as const, className }
  switch (kind) {
    case 'dollar':
      return <IconCurrencyDollar {...common} />
    case 'crown':
      return <IconCrown {...common} />
    case 'gift':
      return <IconGift {...common} />
    case 'transfer':
      return <IconArrowsRightLeft {...common} />
    case 'crownOff':
      return <IconCrownOff {...common} />
    default:
      return null
  }
}

type OrderProps = {
  kind: OrderRowIcon
  size?: number
  stroke?: number
}

export function OrderRowIcon({ kind, size = 24, stroke = 1.75 }: OrderProps) {
  const common = { size, stroke, 'aria-hidden': true as const }
  return kind === 'crown' ? <IconCrown {...common} /> : <IconArrowsExchange {...common} />
}
