import { formatListDateTimeLoose } from './formatListDateTime'
import type { ActivityFeedItem } from '../../rewardLifecycle/activityFeedModel'
import type {
  LifecycleActivityPreviewItem,
  LifecycleUpcomingItem,
} from '../../rewardLifecycle/lifecycleSteps'
import type { TransactionRowModel } from './transactionTypes'

export function fromActivityFeedItem(item: ActivityFeedItem): TransactionRowModel {
  return {
    icon: item.icon,
    title: item.title,
    amount: item.amount,
    amountTone: item.amountTone,
    lines: item.lines,
    trailing: formatListDateTimeLoose(item.time),
  }
}

export function fromUpcomingItem(item: LifecycleUpcomingItem): TransactionRowModel {
  return {
    icon: item.icon,
    title: item.title,
    amount: item.amount,
    lines: item.lines,
    trailing: formatListDateTimeLoose(item.date),
    badge: item.badge,
  }
}

export function fromActivityPreview(item: LifecycleActivityPreviewItem): TransactionRowModel {
  return {
    icon: item.icon,
    title: item.title,
    amount: item.amount,
    lines: item.lines,
    trailing: formatListDateTimeLoose(item.date),
  }
}

export type { TransactionRowModel } from './transactionTypes'
