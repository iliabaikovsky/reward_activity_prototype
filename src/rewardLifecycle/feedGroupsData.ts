import type { ActivityFeedGroup, ActivityFeedItem } from './activityFeedModel'
import {
  ADJUSTMENT_LIST_SUBTITLE,
  CB_ACCOUNT_INR_LINE,
  CB_ACCOUNT_JPY_LINE,
  CB_ACCOUNT_THB_LINE,
  CB_LIST_SUBTITLE,
  LOYALTY_TO_AVAILABLE_SUBTITLE,
  LOY_PERIOD_NEXT_LABEL,
  LOY_PERIOD_PREV_LABEL,
} from './demoTimeline'

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
      lines: [ADJUSTMENT_LIST_SUBTITLE],
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
      lines: [LOYALTY_TO_AVAILABLE_SUBTITLE, `For trading on ${LOY_PERIOD_PREV_LABEL}`],
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
      title: 'EXD cashback',
      amount: '+5.00 USD',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_MAR16: ActivityFeedGroup = {
  dateLabel: '16 Mar 2026',
  dateIso: '2026-03-16',
  summary: '+4.50 USD',
  items: [
    item({
      id: 'feed-cb-mar16',
      title: 'EXD cashback',
      amount: '+4.50 USD',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_MAR15: ActivityFeedGroup = {
  dateLabel: '15 Mar 2026',
  dateIso: '2026-03-15',
  summary: '+3.80 USD',
  items: [
    item({
      id: 'feed-cb-mar15',
      title: 'EXD cashback',
      amount: '+3.80 USD',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_MAR14: ActivityFeedGroup = {
  dateLabel: '14 Mar 2026',
  dateIso: '2026-03-14',
  summary: '+5.20 USD',
  items: [
    item({
      id: 'feed-cb-mar14',
      title: 'EXD cashback',
      amount: '+5.20 USD',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_MAR25: ActivityFeedGroup = {
  dateLabel: '25 Mar 2026',
  dateIso: '2026-03-25',
  summary: '+2.80 EXD',
  items: [
    item({
      id: 'feed-loy-act-open',
      title: 'Loyalty rewards',
      amount: '+2.80 EXD',
      amountTone: 'positive',
      lines: [LOYALTY_TO_AVAILABLE_SUBTITLE, 'For trading on Mar 16–22'],
      time: '23:58',
      icon: 'crown',
      rewardModal: 'loyalty-activated',
      category: 'rewards',
    }),
    item({
      id: 'feed-cb-mar24',
      title: 'EXD cashback',
      amount: '+4.80 USD',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_MAR26: ActivityFeedGroup = {
  dateLabel: '26 Mar 2026',
  dateIso: '2026-03-26',
  summary: '+4.20 USD',
  items: [
    item({
      id: 'feed-cb-mar25',
      title: 'EXD cashback',
      amount: '+4.20 USD',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_APR19: ActivityFeedGroup = {
  dateLabel: '19 Apr 2026',
  dateIso: '2026-04-19',
  summary: '+698 JPY',
  items: [
    item({
      id: 'feed-cb-apr19-jpy',
      title: 'EXD cashback',
      amount: '+698 JPY',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_JPY_LINE],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_APR20: ActivityFeedGroup = {
  dateLabel: '20 Apr 2026',
  dateIso: '2026-04-20',
  summary: '+152.00 THB',
  items: [
    item({
      id: 'feed-cb-apr20-thb',
      title: 'EXD cashback',
      amount: '+152.00 THB',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_THB_LINE],
      time: '08:00',
      icon: 'dollar',
      rewardModal: 'cashback-activated',
      category: 'cashback',
    }),
  ],
}

export const G_APR18: ActivityFeedGroup = {
  dateLabel: '18 Apr 2026',
  dateIso: '2026-04-18',
  summary: '+392.00 INR',
  items: [
    item({
      id: 'feed-cb-apr18-inr',
      title: 'EXD cashback',
      amount: '+392.00 INR',
      amountTone: 'positive',
      lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_INR_LINE],
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
      lines: [LOYALTY_TO_AVAILABLE_SUBTITLE, `For trading on ${LOY_PERIOD_NEXT_LABEL}`],
      time: '23:59',
      icon: 'crown',
      rewardModal: 'loyalty-activated',
      category: 'rewards',
    }),
  ],
}
