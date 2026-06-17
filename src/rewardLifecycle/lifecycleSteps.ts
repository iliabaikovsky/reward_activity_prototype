import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import type { RewardEventIcon } from '../domain/reward/types'
import type { ActivityFeedGroup } from './activityFeedModel'
import {
  G_APR1,
  G_APR18,
  G_APR19,
  G_APR20,
  G_MAR18_LOYALTY_ONLY,
  G_MAR21_TRANSFER_320,
  G_MAR24_CASHBACK_300,
  G_MAR25,
  G_MAR26,
} from './feedGroupsData'
import {
  CB_LIST_SUBTITLE,
  CB_ACCOUNT_INR_LINE,
  CB_ACCOUNT_JPY_LINE,
  CB_ACCOUNT_LIST_LINE,
  CB_ACCOUNT_THB_LINE,
  LIFECYCLE_STEP_TODAY_ISO,
  LOY_ACTIVATION_MATURE_SHORT,
  LOY_ACTIVATION_OPEN_SHORT,
  LOY_ACTIVATION_PREV_SHORT,
  LOYALTY_TO_AVAILABLE_SUBTITLE,
  LOY_PERIOD_MATURE_LABEL,
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
 * 7 шагов симулятора (UT lifecycle + dev rail).
 * Упрощено: без gift / adjustment / дубля upcoming; transfer 3.20 EXD; cashback 3.00 USD.
 */
export const LIFECYCLE_STEPS: LifecycleStep[] = [
  {
    id: 'empty',
    label: 'Новый пользователь',
    docRef: '§0 · 17 Jun 2026 (симулятор)',
    simulatorTodayIso: LIFECYCLE_STEP_TODAY_ISO[0],
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
    docRef: `§2 · ${LOY_PERIOD_OPEN_LABEL}, badge 4 · → ${upcomingLoyaltyDate(LOY_ACTIVATION_OPEN_SHORT)}`,
    simulatorTodayIso: LIFECYCLE_STEP_TODAY_ISO[1],
    simulatorBlurb: {
      lead: `Поторговал на этой неделе (${LOY_PERIOD_OPEN_LABEL}).`,
      bullets: [
        'Upcoming loyalty +4.20 EXD (4 ордера в пачке)',
        'Available 0 EXD, Activity пустая',
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
    label: 'Активация loyalty',
    docRef: `§3 · ${LOY_ACTIVATION_PREV_SHORT}: loyalty +3.20 EXD → Available`,
    simulatorTodayIso: LIFECYCLE_STEP_TODAY_ISO[2],
    simulatorBlurb: {
      lead: `Неделя закрылась, loyalty активировалась (${LOY_ACTIVATION_PREV_SHORT}).`,
      bullets: [
        'Upcoming пустой',
        '+3.20 EXD в Available',
        'В ленте — Loyalty rewards',
      ],
    },
    availableRewardsExd: '3.20 EXD',
    tradingWalletLabel: 'No accounts with reward',
    tradingWalletValue: '0.00 EXD',
    tradingWalletMuted: true,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 3.2,
    upcoming: [],
    activityPreview: [
      {
        id: 'prev-loy-1',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.20 EXD',
        lines: [LOYALTY_TO_AVAILABLE_SUBTITLE, `For trading on ${LOY_PERIOD_PREV_LABEL}`],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:58`,
        badge: '3',
        rewardModal: 'loyalty-activated',
      },
    ],
    feedGroups: [G_MAR18_LOYALTY_ONLY],
  },
  {
    id: 'transfer',
    label: 'Transfer на счёт',
    docRef: '§6 · 18 Jun · 3.20 EXD',
    simulatorTodayIso: LIFECYCLE_STEP_TODAY_ISO[3],
    simulatorBlurb: {
      lead: 'Перевёл EXD на торговый счёт (18 Jun).',
      bullets: ['Available 0 EXD', '3.20 EXD на счёте #12345678', 'В ленте — Transfer'],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'Account #12345678',
    tradingWalletValue: '3.20 EXD',
    tradingWalletMuted: false,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 3.2,
    upcoming: [],
    activityPreview: [
      {
        id: 'prev-tr',
        icon: 'transfer',
        title: 'Transfer',
        amount: '3.20 EXD',
        lines: ['To account: #12345678'],
        date: 'Jun 18, 09:30',
        rewardModal: 'transfer-exd',
      },
      {
        id: 'prev-loy-tr',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.20 EXD',
        lines: [LOYALTY_TO_AVAILABLE_SUBTITLE, `For trading on ${LOY_PERIOD_PREV_LABEL}`],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:58`,
        rewardModal: 'loyalty-activated',
      },
    ],
    feedGroups: [G_MAR21_TRANSFER_320, G_MAR18_LOYALTY_ONLY],
  },
  {
    id: 'trade_exd_rebate',
    label: 'Сделка: cashback pending + loyalty',
    docRef: '§7–8 · 19 Jun · spent 3.20 EXD',
    simulatorTodayIso: LIFECYCLE_STEP_TODAY_ISO[4],
    simulatorBlurb: {
      lead: 'Сделка со списанием EXD под cashback (19 Jun).',
      bullets: [
        'На счёте 0 EXD (потратили 3.20)',
        'Upcoming: +3 USD cashback и +1 EXD loyalty',
        'Lifetime cashback 0 USD',
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'Account #12345678',
    tradingWalletValue: '0.00 EXD',
    tradingWalletMuted: false,
    lifetimeCashbackUsd: '0.00 USD',
    tierEarnedExdTowardGoal: 4.2,
    upcoming: [
      {
        id: 'up-cb-pend',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+3.00 USD',
        lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_LIST_LINE],
        date: 'on Jun 20',
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
        amount: '3.20 EXD',
        lines: ['To account: #12345678'],
        date: 'Jun 18, 09:30',
        rewardModal: 'transfer-exd',
      },
      {
        id: 'prev-loy-b',
        icon: 'crown',
        title: 'Loyalty rewards',
        amount: '+3.20 EXD',
        lines: [LOYALTY_TO_AVAILABLE_SUBTITLE, `For trading on ${LOY_PERIOD_PREV_LABEL}`],
        date: `${LOY_ACTIVATION_PREV_SHORT}, 23:58`,
        rewardModal: 'loyalty-activated',
      },
    ],
    feedGroups: [G_MAR21_TRANSFER_320, G_MAR18_LOYALTY_ONLY],
  },
  {
    id: 'cashback_settled',
    label: 'Cashback зачислен',
    docRef: '§8–9 · 21 Jun · +3 USD',
    simulatorTodayIso: LIFECYCLE_STEP_TODAY_ISO[5],
    simulatorBlurb: {
      lead: 'Cashback пришёл на счёт (21 Jun).',
      bullets: [
        '+3 USD ушли из Upcoming → Lifetime cashback 3 USD',
        `Loyalty +1 EXD всё ещё в Upcoming до ${LOY_ACTIVATION_OPEN_SHORT}`,
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'Account #12345678',
    tradingWalletValue: '0.00 EXD',
    tradingWalletMuted: false,
    lifetimeCashbackUsd: '3.00 USD',
    tierEarnedExdTowardGoal: 4.2,
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
        amount: '+3.00 USD',
        lines: [CB_LIST_SUBTITLE, 'Account: #12345678'],
        date: 'Jun 21, 08:00',
        rewardModal: 'cashback-activated',
      },
      {
        id: 'prev-tr-c',
        icon: 'transfer',
        title: 'Transfer',
        amount: '3.20 EXD',
        lines: ['To account: #12345678'],
        date: 'Jun 18, 09:30',
        rewardModal: 'transfer-exd',
      },
    ],
    feedGroups: [G_MAR24_CASHBACK_300, G_MAR21_TRANSFER_320, G_MAR18_LOYALTY_ONLY],
  },
  {
    id: 'mature_trader_tuesday',
    label: 'Месяц торговли',
    docRef: '§10 · 18 Jul — ~месяц после старта (17 Jun)',
    simulatorTodayIso: LIFECYCLE_STEP_TODAY_ISO[6],
    simulatorBlurb: {
      lead: 'Прошёл ~месяц с первых шагов (17 Jun → 18 Jul).',
      bullets: [
        'Lifetime cashback ~38 USD',
        'На счёте 62.40 EXD',
        `Upcoming: loyalty ${LOY_PERIOD_MATURE_LABEL} + 3 cashback (THB / JPY / INR)`,
      ],
    },
    availableRewardsExd: '0.00 EXD',
    tradingWalletLabel: 'Account #12345678',
    tradingWalletValue: '62.40 EXD',
    tradingWalletMuted: false,
    lifetimeCashbackUsd: '38.00 USD',
    tierEarnedExdTowardGoal: 12,
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
        id: 'up-cb-mature-thb',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+148.50 THB',
        lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_THB_LINE],
        date: 'on Jul 19',
        rewardModal: 'cashback-upcoming',
      },
      {
        id: 'up-cb-mature-jpy',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+672 JPY',
        lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_JPY_LINE],
        date: 'on Jul 19',
        rewardModal: 'cashback-upcoming',
      },
      {
        id: 'up-cb-mature-inr',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+385.00 INR',
        lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_INR_LINE],
        date: 'on Jul 19',
        rewardModal: 'cashback-upcoming',
      },
    ],
    activityPreview: [
      {
        id: 'prev-cb-apr20-thb',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+152.00 THB',
        lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_THB_LINE],
        date: 'Jul 18, 08:00',
        rewardModal: 'cashback-activated',
      },
      {
        id: 'prev-cb-apr19-jpy',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+698 JPY',
        lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_JPY_LINE],
        date: 'Jul 17, 08:00',
        rewardModal: 'cashback-activated',
      },
      {
        id: 'prev-cb-apr18-inr',
        icon: 'dollar',
        title: 'EXD cashback',
        amount: '+392.00 INR',
        lines: [CB_LIST_SUBTITLE, CB_ACCOUNT_INR_LINE],
        date: 'Jul 16, 08:00',
        rewardModal: 'cashback-activated',
      },
      {
        id: 'prev-tr-mature',
        icon: 'transfer',
        title: 'Transfer',
        amount: '3.20 EXD',
        lines: ['To account: #12345678'],
        date: 'Jun 18, 09:30',
        rewardModal: 'transfer-exd',
      },
    ],
    feedGroups: [G_APR20, G_APR19, G_APR18, G_APR1, G_MAR26, G_MAR25, G_MAR24_CASHBACK_300],
  },
]
