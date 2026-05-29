import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import type { RewardEventIcon } from '../domain/reward/types'
import type { ActivityFeedGroup } from './activityFeedModel'
import {
  G_MAR18,
  G_MAR19,
  G_MAR21,
  G_MAR24,
} from './feedGroupsData'
import {
  CB_PENDING_TRADE_DAY_SHORT,
  LOY_ACTIVATION_OPEN_SHORT,
  LOY_ACTIVATION_PREV_SHORT,
  LOY_PERIOD_OPEN_LABEL,
  LOY_PERIOD_PREV_LABEL,
  upcomingLoyaltyDate,
} from './demoTimeline'

export type LifecycleUpcomingItem = {
  id: string
  icon: 'dollar' | 'crown'
  title: string
  amount: string
  lines: string[]
  date: string
  badge?: string
  rewardModal: RewardModalVariant
}

/** @deprecated Use RewardEventIcon from domain/reward/types */
export type LifecycleActivityIcon = RewardEventIcon

export type LifecycleActivityPreviewItem = {
  id: string
  icon: RewardEventIcon
  title: string
  amount: string
  lines: string[]
  date: string
  rewardModal: RewardModalVariant
}

/** Человекочитаемое описание шага для панели симулятора (desktop). */
export type LifecycleSimulatorBlurb = {
  lead: string
  bullets: string[]
}

export type LifecycleStep = {
  id: string
  label: string
  docRef: string
  simulatorBlurb: LifecycleSimulatorBlurb
  availableRewardsExd: string
  tradingWalletLabel: string
  tradingWalletValue: string
  /** Второй кошелёк как «неактивный» в макете */
  tradingWalletMuted: boolean
  lifetimeCashbackUsd: string
  /**
   * Накопительный EXD от наград для полосы «Earn 1000 EXD».
   * Не снижается при списании EXD на счёте (rebate); loyalty в Upcoming добавляется в UI отдельно.
   */
  tierEarnedExdTowardGoal: number
  upcoming: LifecycleUpcomingItem[]
  activityPreview: LifecycleActivityPreviewItem[]
  feedGroups: ActivityFeedGroup[]
}

/**
 * Шаги симулятора (индекс = фаза пути пользователя).
 * Даты от якоря **20 Mar 2026**; loyalty — период ср–вс, активация в следующую среду.
 */
export const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    id: 'empty',
    label: 'Новый пользователь',
    docRef: '§0 · 20 Mar 2026 (симулятор)',
    simulatorBlurb: {
      lead: 'Ещё не торговал — пустой экран.',
      bullets: ['Кошельки и Upcoming — нули', 'Activity feed пустая'],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'No accounts with reward',
    tradingWalletValue: '0.00 EXD',
    tradingWalletMuted: true,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 0,
    upcoming: [],
    activityPreview: [],
    feedGroups: [],
  },
  {
    id: 'upcoming_loyalty',
    label: 'Торговля → pending loyalty',
    docRef: `§2 · период ${LOY_PERIOD_OPEN_LABEL} → ${upcomingLoyaltyDate(LOY_ACTIVATION_OPEN_SHORT)}`,
    simulatorBlurb: {
      lead: `Поторговал на этой неделе (${LOY_PERIOD_OPEN_LABEL}).`,
      bullets: [
        `В Upcoming появилась loyalty +3.20 EXD → ${upcomingLoyaltyDate(LOY_ACTIVATION_OPEN_SHORT)}`,
        'В Available пока 0 EXD, в ленте ничего',
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'No accounts with reward',
    tradingWalletValue: '0.00 EXD',
    tradingWalletMuted: true,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 0,
    upcoming: [
      {
        id: 'up-loy-1',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.20 EXD',
        lines: [`For trading on ${LOY_PERIOD_OPEN_LABEL}`],
        date: upcomingLoyaltyDate(LOY_ACTIVATION_OPEN_SHORT),
        rewardModal: 'loyalty-upcoming',
      },
    ],
    activityPreview: [],
    feedGroups: [],
  },
  {
    id: 'upcoming_loyalty_more',
    label: 'Ещё сделки — Upcoming растёт',
    docRef: `§2 · было +3.20 → +4.20 EXD (ещё сделка), badge 4 · ${LOY_PERIOD_OPEN_LABEL}`,
    simulatorBlurb: {
      lead: 'Та же неделя, добавились сделки.',
      bullets: [
        'Пачка loyalty выросла до +4.20 EXD (badge 4)',
        'Available по-прежнему 0 EXD — ждём среду',
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'No accounts with reward',
    tradingWalletValue: '0.00 EXD',
    tradingWalletMuted: true,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 0,
    upcoming: [
      {
        id: 'up-loy-1-more',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+4.20 EXD',
        lines: [`For trading on ${LOY_PERIOD_OPEN_LABEL}`],
        date: upcomingLoyaltyDate(LOY_ACTIVATION_OPEN_SHORT),
        badge: '4',
        rewardModal: 'loyalty-upcoming',
      },
    ],
    activityPreview: [],
    feedGroups: [],
  },
  {
    id: 'activation_1',
    label: 'Активация + adjustment',
    docRef: `§3–5 · ${LOY_ACTIVATION_PREV_SHORT}: loyalty +3.20, сразу −0.40 → 2.80 EXD`,
    simulatorBlurb: {
      lead: `Неделя закрылась, loyalty активировалась (${LOY_ACTIVATION_PREV_SHORT}).`,
      bullets: [
        'Upcoming очистился',
        '+2.80 EXD в Available (+3.20, затем −0.40 adjustment)',
        'В ленте: Loyalty rewards и EXD adjustment',
      ],
    },
    availableRewardsExd: '2.80 EXD',
    tradingWalletLabel: 'No accounts with reward',
    tradingWalletValue: '0.00 EXD',
    tradingWalletMuted: true,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 2.8,
    upcoming: [],
    activityPreview: [
      {
        id: 'prev-adj-act',
        icon: 'crownOff',
        title: 'EXD adjustment',
        amount: '-0.40 EXD',
        lines: ['Balance correction', 'Account: #12345678'],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:59`,
        rewardModal: 'exd-adjustment',
      },
      {
        id: 'prev-loy-1',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.20 EXD',
        lines: ['To Available rewards', `For trading on ${LOY_PERIOD_PREV_LABEL}`],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:58`,
        rewardModal: 'loyalty-activated',
      },
    ],
    feedGroups: [G_MAR18],
  },
  {
    id: 'gift',
    label: 'Подарок (special_reward)',
    docRef: '§4 gift · 19 Mar',
    simulatorBlurb: {
      lead: 'Пришёл промо-подарок (19 Mar).',
      bullets: [
        '+50 EXD birthday gift → Available 52.80 EXD',
        'Upcoming пустой, в ленте новая строка',
      ],
    },
    availableRewardsExd: '52.80 EXD',
    tradingWalletLabel: 'No accounts with reward',
    tradingWalletValue: '0.00 EXD',
    tradingWalletMuted: true,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 52.8,
    upcoming: [],
    activityPreview: [
      {
        id: 'prev-gift',
        icon: 'gift',
        title: 'Birthday gift',
        amount: '+50.00 EXD',
        lines: ['Best wishes! ✨'],
        date: 'Mar 19, 16:15',
        rewardModal: 'promo-gift',
      },
      {
        id: 'prev-adj-gift',
        icon: 'crownOff',
        title: 'EXD adjustment',
        amount: '-0.40 EXD',
        lines: ['Balance correction', 'Account: #12345678'],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:59`,
        rewardModal: 'exd-adjustment',
      },
      {
        id: 'prev-loy-1b',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.20 EXD',
        lines: ['To Available rewards', `For trading on ${LOY_PERIOD_PREV_LABEL}`],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:58`,
        rewardModal: 'loyalty-activated',
      },
    ],
    feedGroups: [G_MAR19, G_MAR18],
  },
  {
    id: 'transfer',
    label: 'Transfer на счёт',
    docRef: '§6 · 21 Mar',
    simulatorBlurb: {
      lead: 'Перевёл EXD на торговый счёт (21 Mar).',
      bullets: [
        'Available 0 EXD',
        '52.80 EXD на счёте #12345678',
        'В ленте — Transfer',
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'Account #12345678',
    tradingWalletValue: '52.80 EXD',
    tradingWalletMuted: false,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 52.8,
    upcoming: [],
    activityPreview: [
      {
        id: 'prev-tr',
        icon: 'transfer',
        title: 'Transfer',
        amount: '52.80 EXD',
        lines: ['To account: #12345678'],
        date: 'Mar 21, 09:30',
        rewardModal: 'transfer-exd',
      },
      {
        id: 'prev-gift-c',
        icon: 'gift',
        title: 'Birthday gift',
        amount: '+50.00 EXD',
        lines: ['Best wishes! ✨'],
        date: 'Mar 19, 16:15',
        rewardModal: 'promo-gift',
      },
      {
        id: 'prev-adj-b',
        icon: 'crownOff',
        title: 'EXD adjustment',
        amount: '-0.40 EXD',
        lines: ['Balance correction', 'Account: #12345678'],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:59`,
        rewardModal: 'exd-adjustment',
      },
    ],
    feedGroups: [G_MAR21, G_MAR19, G_MAR18],
  },
  {
    id: 'trade_exd_rebate',
    label: 'Сделка: cashback pending + loyalty',
    docRef: '§7–8 · 22 Mar',
    simulatorBlurb: {
      lead: 'Сделка со списанием EXD под cashback (22 Mar).',
      bullets: [
        'На счёте 47.80 EXD (было 52.80)',
        'В Upcoming: +5 USD cashback и +1 EXD loyalty',
        'Lifetime cashback пока 0 USD',
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'Account #12345678',
    tradingWalletValue: '47.80 EXD',
    tradingWalletMuted: false,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 52.8,
    upcoming: [
      {
        id: 'up-cb-pend',
        icon: 'dollar',
        title: 'Cashback',
        amount: '+5.00 USD',
        lines: [`For trading on ${CB_PENDING_TRADE_DAY_SHORT}`],
        date: 'on Mar 23',
        rewardModal: 'cashback-upcoming',
      },
      {
        id: 'up-loy-2',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+1.00 EXD',
        lines: [`For trading on ${LOY_PERIOD_OPEN_LABEL}`],
        date: upcomingLoyaltyDate(LOY_ACTIVATION_OPEN_SHORT),
        rewardModal: 'loyalty-upcoming',
      },
    ],
    activityPreview: [
      {
        id: 'prev-tr-b',
        icon: 'transfer',
        title: 'Transfer',
        amount: '52.80 EXD',
        lines: ['To account: #12345678'],
        date: 'Mar 21, 09:30',
        rewardModal: 'transfer-exd',
      },
      {
        id: 'prev-gift-d',
        icon: 'gift',
        title: 'Birthday gift',
        amount: '+50.00 EXD',
        lines: ['Best wishes! ✨'],
        date: 'Mar 19, 16:15',
        rewardModal: 'promo-gift',
      },
      {
        id: 'prev-adj-c',
        icon: 'crownOff',
        title: 'EXD adjustment',
        amount: '-0.40 EXD',
        lines: ['Balance correction', 'Account: #12345678'],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:59`,
        rewardModal: 'exd-adjustment',
      },
    ],
    feedGroups: [G_MAR21, G_MAR19, G_MAR18],
  },
  {
    id: 'cashback_settled',
    label: 'Cashback зачислен',
    docRef: '§8–9 · 24 Mar',
    simulatorBlurb: {
      lead: 'Cashback пришёл на счёт (24 Mar).',
      bullets: [
        '+5 USD ушли из Upcoming → Lifetime cashback 5 USD',
        `Loyalty +1 EXD всё ещё в Upcoming до ${LOY_ACTIVATION_OPEN_SHORT}`,
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'Account #12345678',
    tradingWalletValue: '47.80 EXD',
    tradingWalletMuted: false,
    lifetimeCashbackUsd: '5.00 USD',
    tierEarnedExdTowardGoal: 52.8,
    upcoming: [
      {
        id: 'up-loy-3',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+1.00 EXD',
        lines: [`For trading on ${LOY_PERIOD_OPEN_LABEL}`],
        date: upcomingLoyaltyDate(LOY_ACTIVATION_OPEN_SHORT),
        rewardModal: 'loyalty-upcoming',
      },
    ],
    activityPreview: [
      {
        id: 'prev-cb',
        icon: 'dollar',
        title: 'Cashback',
        amount: '+5.00 USD',
        lines: ['For trading on Mar 22', 'Account: #12345678'],
        date: 'Mar 24, 08:00',
        rewardModal: 'cashback-activated',
      },
      {
        id: 'prev-tr-c',
        icon: 'transfer',
        title: 'Transfer',
        amount: '52.80 EXD',
        lines: ['To account: #12345678'],
        date: 'Mar 21, 09:30',
        rewardModal: 'transfer-exd',
      },
      {
        id: 'prev-adj-d',
        icon: 'crownOff',
        title: 'EXD adjustment',
        amount: '-0.40 EXD',
        lines: ['Balance correction', 'Account: #12345678'],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:59`,
        rewardModal: 'exd-adjustment',
      },
    ],
    feedGroups: [G_MAR24, G_MAR21, G_MAR19, G_MAR18],
  },
]
