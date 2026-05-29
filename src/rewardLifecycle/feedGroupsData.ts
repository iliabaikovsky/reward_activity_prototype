import type { ActivityFeedGroup, ActivityFeedItem } from './activityFeedModel'
import { LOY_PERIOD_NEXT_LABEL, LOY_PERIOD_PREV_LABEL } from './demoTimeline'

const item = (x: ActivityFeedItem): ActivityFeedItem => x

/** Первая активация: loyalty + adjustment в один день */
export const G_MAR18: ActivityFeedGroup = {
  dateLabel: '18 Mar 2026',
  dateIso: '2026-03-18',
  summary: '+2.80 EXD',
  items: [
    item({
      id: 'feed-adj-1',
      title: 'EXD adjustment',
      amount: '-0.40 EXD',
      amountTone: 'negative',
      lines: ['Balance correction', 'Account: #12345678'],
      time: '23:59',
      icon: 'crownOff',
      rewardModal: 'exd-adjustment',
      category: 'others',
    }),
    item({
      id: 'feed-loy-act-1',
      title: 'Loyalty rewards',
      amount: '+3.20 EXD',
      amountTone: 'positive',
      lines: ['To Available rewards', `For trading on ${LOY_PERIOD_PREV_LABEL}`],
      time: '23:58',
      icon: 'crown',
      rewardModal: 'loyalty-activated',
      category: 'rewards',
    }),
  ],
}

export const G_MAR19: ActivityFeedGroup = {
  dateLabel: '19 Mar 2026',
  dateIso: '2026-03-19',
  summary: '+50.00 EXD',
  items: [
    item({
      id: 'feed-gift-1',
      title: 'Birthday gift',
      amount: '+50.00 EXD',
      amountTone: 'positive',
      lines: ['Best wishes! ✨'],
      time: '16:15',
      icon: 'gift',
      rewardModal: 'promo-gift',
      category: 'rewards',
    }),
  ],
}

export const G_MAR21: ActivityFeedGroup = {
  dateLabel: '21 Mar 2026',
  dateIso: '2026-03-21',
  summary: '-52.80 EXD',
  items: [
    item({
      id: 'feed-tr-1',
      title: 'Transfer',
      amount: '52.80 EXD',
      amountTone: 'neutral',
      lines: ['To account: #12345678'],
      time: '09:30',
      icon: 'transfer',
      rewardModal: 'transfer-exd',
      category: 'transfers',
    }),
  ],
}

export const G_MAR24: ActivityFeedGroup = {
  dateLabel: '24 Mar 2026',
  dateIso: '2026-03-24',
  summary: '+5.00 USD',
  items: [
    item({
      id: 'feed-cb-1',
      title: 'Cashback',
      amount: '+5.00 USD',
      amountTone: 'positive',
      lines: ['For trading on Mar 22', 'Account: #12345678'],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_APR1: ActivityFeedGroup = {
  dateLabel: '1 Apr 2026',
  dateIso: '2026-04-01',
  summary: '+2.00 EXD',
  items: [
    item({
      id: 'feed-loy-act-2',
      title: 'Loyalty rewards',
      amount: '+2.00 EXD',
      amountTone: 'positive',
      lines: ['To Available rewards', `For trading on ${LOY_PERIOD_NEXT_LABEL}`],
      time: '23:59',
      icon: 'crown',
      rewardModal: 'loyalty-activated',
      category: 'rewards',
    }),
  ],
}
