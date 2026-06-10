import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import type { RewardEventIcon } from '../domain/reward/types'
import type { ActivityFeedGroup } from './activityFeedModel'
import {
  G_MAR18,
  G_MAR19,
  G_MAR21,
  G_MAR24,
  G_MAR25,
  G_MAR26,
  G_APR1,
  G_APR19,
  G_APR20,
} from './feedGroupsData'
import {
  CB_LIST_SUBTITLE,
  LOY_ACTIVATION_OPEN_SHORT,
  LOY_ACTIVATION_PREV_SHORT,
  LOY_PERIOD_OPEN_LABEL,
  LOY_PERIOD_PREV_LABEL,
  upcomingLoyaltyDate,
} from './demoTimeline'

/** Период loyalty для шага 9 (~Apr 20, месяц после старта Mar 20). */
const LOY_PERIOD_MATURE_LABEL = 'Apr 13–19'
const LOY_ACTIVATION_MATURE_SHORT = 'Apr 22'

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
  /** Число ордеров в пачке (как badge у Upcoming). */
  badge?: string
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
  /** Дата «сегодня» для этого шага симулятора (YYYY-MM-DD). */
  simulatorTodayIso: string
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
 * Даты от якоря **20 Mar 2026**; loyalty — агрегат пн–вс, зачисление в среду после недели.
 * На каждом шаге своя `simulatorTodayIso` — «когда пользователь смотрит экран».
 */
export const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    id: 'empty',
    label: 'Новый пользователь',
    docRef: '§0 · 20 Mar 2026 (симулятор)',
    simulatorTodayIso: '2026-03-20',
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
    simulatorTodayIso: '2026-03-20',
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
    simulatorTodayIso: '2026-03-20',
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
    simulatorTodayIso: '2026-03-18',
    simulatorBlurb: {
      lead: `Неделя закрылась, loyalty активировалась (${LOY_ACTIVATION_PREV_SHORT}).`,
      bullets: [
        'Активировалась пачка Mar 9–15 (+3.20 EXD, 3 ордера)',
        'Upcoming пустой (пачка Mar 9–15 ушла в ленту)',
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
        lines: [],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:59`,
        rewardModal: 'exd-adjustment',
      },
      {
        id: 'prev-loy-1',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.20 EXD',
        lines: ['To wallet', `For trading on ${LOY_PERIOD_PREV_LABEL}`],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:58`,
        badge: '3',
        rewardModal: 'loyalty-activated',
      },
    ],
    feedGroups: [G_MAR18],
  },
  {
    id: 'gift',
    label: 'Подарок (special_reward)',
    docRef: '§4 gift · 19 Mar',
    simulatorTodayIso: '2026-03-19',
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
        lines: [],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:59`,
        rewardModal: 'exd-adjustment',
      },
      {
        id: 'prev-loy-1b',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.20 EXD',
        lines: ['To wallet', `For trading on ${LOY_PERIOD_PREV_LABEL}`],
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
    simulatorTodayIso: '2026-03-21',
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
        lines: [],
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
    simulatorTodayIso: '2026-03-22',
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
        title: 'EXD cashback',
        amount: '+5.00 USD',
        lines: [CB_LIST_SUBTITLE],
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
        lines: [],
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
    simulatorTodayIso: '2026-03-24',
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
        title: 'EXD cashback',
        amount: '+5.00 USD',
        lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
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
        lines: [],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:59`,
        rewardModal: 'exd-adjustment',
      },
    ],
    feedGroups: [G_MAR24, G_MAR21, G_MAR19, G_MAR18],
  },
  {
    id: 'mature_trader_tuesday',
    label: 'Месяц торговли',
    docRef: '§10 · 20 Apr — ~месяц после старта (20 Mar)',
    simulatorTodayIso: '2026-04-20',
    simulatorBlurb: {
      lead: 'Прошёл ~месяц с первых шагов (20 Mar → 20 Apr).',
      bullets: [
        'Lifetime cashback ~38 USD за месяц ежедневной торговли',
        'На счёте 62.40 EXD',
        `В Upcoming: loyalty ${LOY_PERIOD_MATURE_LABEL} → ${LOY_ACTIVATION_MATURE_SHORT} и EXD cashback за Apr 20`,
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'Account #12345678',
    tradingWalletValue: '62.40 EXD',
    tradingWalletMuted: false,
    lifetimeCashbackUsd: '38.00 USD',
    tierEarnedExdTowardGoal: 54.8,
    upcoming: [
      {
        id: 'up-loy-mature',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.40 EXD',
        lines: [`For trading on ${LOY_PERIOD_MATURE_LABEL}`],
        date: upcomingLoyaltyDate(LOY_ACTIVATION_MATURE_SHORT),
        badge: '4',
        rewardModal: 'loyalty-upcoming',
      },
      {
        id: 'up-cb-mature',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+4.50 USD',
        lines: [CB_LIST_SUBTITLE],
        date: 'on Apr 21',
        rewardModal: 'cashback-upcoming',
      },
    ],
    activityPreview: [
      {
        id: 'prev-cb-apr19-mature',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+4.60 USD',
        lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
        date: 'Apr 20, 08:00',
        rewardModal: 'cashback-activated',
      },
      {
        id: 'prev-cb-apr18-mature',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+4.80 USD',
        lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
        date: 'Apr 19, 08:00',
        rewardModal: 'cashback-activated',
      },
      {
        id: 'prev-cb-apr17-mature',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+4.20 USD',
        lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
        date: 'Apr 18, 08:00',
        rewardModal: 'cashback-activated',
      },
      {
        id: 'prev-tr-mature',
        icon: 'transfer',
        title: 'Transfer',
        amount: '52.80 EXD',
        lines: ['To account: #12345678'],
        date: 'Mar 21, 09:30',
        rewardModal: 'transfer-exd',
      },
    ],
    feedGroups: [G_APR20, G_APR19, G_APR1, G_MAR26, G_MAR25, G_MAR24],
  },
]
