import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import {
  IconArrowsExchange,
  IconArrowsRightLeft,
  IconChevronLeft,
  IconChevronRight,
  IconCrown,
  IconCrownOff,
  IconCurrencyDollar,
  IconGift,
  IconX,
} from '@tabler/icons-react'
import type { RewardModalVariant } from './rewardModalTypes'
import styles from './RewardDetailModal.module.css'

export type DetailRow = { label: string; value: string }

export type ChipTone = 'warning' | 'success' | 'neutral' | 'negative'

export type HeroIcon = 'crown' | 'dollar' | 'transfer' | 'gift' | 'crownOff'

type OrderRowIcon = 'crown' | 'exchange'

/** Строка в списке Orders + отдельная деталька по клику */
export type OrderInPack = {
  id: string
  listIcon: OrderRowIcon
  title: string
  amount: string
  amountClass?: 'negative'
  meta: string[]
  date: string
  detail: {
    navTitle: string
    chip: { text: string; tone: ChipTone }
    heroIcon: HeroIcon
    amount: string
    amountTone?: 'negative'
    details: DetailRow[]
  }
}

export type PackConfig = {
  navTitle: string
  chip: { text: string; tone: ChipTone }
  heroIcon: HeroIcon
  amount: string
  amountTone?: 'negative'
  details: DetailRow[]
  orders: OrderInPack[]
}

type Props = {
  variant: RewardModalVariant
  onClose: () => void
  /** Данные пачки с симулятора: те же суммы/периоды, что снаружи; ордера без раздувания до 200 */
  packOverride?: PackConfig | null
}

type SimpleConfig = {
  navTitle: string
  chip: { text: string; tone: ChipTone }
  heroIcon: HeroIcon
  amount: string
  amountTone?: 'negative'
  details: DetailRow[]
  orders?: undefined
}

const PACK_CONFIG: Record<
  | 'loyalty-upcoming'
  | 'loyalty-activated'
  | 'cashback-upcoming'
  | 'cashback-activated'
  | 'cashback-activated-jan12',
  PackConfig
> = {
  'loyalty-upcoming': {
    navTitle: 'Loyalty rewards',
    chip: { text: 'Upcoming', tone: 'warning' },
    heroIcon: 'crown',
    amount: '+45.78 EXD',
    details: [
      { label: 'Become available on', value: '31 Jan 2026, 18:43' },
      { label: 'For period', value: '21 Jan 2026 – 25 Jan 2026' },
    ],
    orders: [
      {
        id: 'ly-u-1',
        listIcon: 'crown',
        title: 'Loyalty reward',
        amount: '+15.27 EXD',
        meta: ['Account: #12345678', 'Order: 8829103'],
        date: 'Jan 25, 16:06',
        detail: {
          navTitle: 'Loyalty reward',
          chip: { text: 'Upcoming', tone: 'warning' },
          heroIcon: 'crown',
          amount: '+15.27 EXD',
          details: [
            { label: 'Pack', value: 'Loyalty rewards · Jan 21–25' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '8829103' },
            { label: 'Trading volume', value: '12.4 lots (period)' },
            { label: 'Tier applied', value: 'Ultimate · x2' },
            { label: 'Accrued on', value: '25 Jan 2026, 16:06' },
            { label: 'Line ref.', value: 'LY-ORD-8829103' },
          ],
        },
      },
      {
        id: 'ly-u-2',
        listIcon: 'crown',
        title: 'Loyalty reward',
        amount: '+15.26 EXD',
        meta: ['Account: #12345678', 'Order: 8829104'],
        date: 'Jan 25, 16:06',
        detail: {
          navTitle: 'Loyalty reward',
          chip: { text: 'Upcoming', tone: 'warning' },
          heroIcon: 'crown',
          amount: '+15.26 EXD',
          details: [
            { label: 'Pack', value: 'Loyalty rewards · Jan 21–25' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '8829104' },
            { label: 'Trading volume', value: '11.9 lots (period)' },
            { label: 'Tier applied', value: 'Ultimate · x2' },
            { label: 'Accrued on', value: '25 Jan 2026, 16:06' },
            { label: 'Line ref.', value: 'LY-ORD-8829104' },
          ],
        },
      },
      {
        id: 'ly-u-3',
        listIcon: 'crown',
        title: 'Loyalty reward',
        amount: '+15.25 EXD',
        meta: ['Account: #12345678', 'Order: 8829105'],
        date: 'Jan 25, 16:06',
        detail: {
          navTitle: 'Loyalty reward',
          chip: { text: 'Upcoming', tone: 'warning' },
          heroIcon: 'crown',
          amount: '+15.25 EXD',
          details: [
            { label: 'Pack', value: 'Loyalty rewards · Jan 21–25' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '8829105' },
            { label: 'Trading volume', value: '11.8 lots (period)' },
            { label: 'Tier applied', value: 'Ultimate · x2' },
            { label: 'Accrued on', value: '25 Jan 2026, 16:06' },
            { label: 'Line ref.', value: 'LY-ORD-8829105' },
          ],
        },
      },
    ],
  },
  'loyalty-activated': {
    navTitle: 'Loyalty rewards',
    chip: { text: 'Activated', tone: 'success' },
    heroIcon: 'crown',
    amount: '+89.23 EXD',
    details: [
      { label: 'Moved to available on', value: '15 Jan 2026, 16:15' },
      { label: 'For trading period', value: '5–10 Jan 2026' },
    ],
    orders: [
      {
        id: 'ly-a-1',
        listIcon: 'crown',
        title: 'Loyalty reward',
        amount: '+44.62 EXD',
        meta: ['Account: #12345678', 'Order: 8812001'],
        date: '10 Jan 2026',
        detail: {
          navTitle: 'Loyalty reward',
          chip: { text: 'Activated', tone: 'success' },
          heroIcon: 'crown',
          amount: '+44.62 EXD',
          details: [
            { label: 'Pack', value: 'Loyalty rewards · Jan 5–10' },
            { label: 'Credited to', value: 'Available rewards' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '8812001' },
            { label: 'Trading volume', value: '28.1 lots (period)' },
            { label: 'Posted on', value: '15 Jan 2026, 16:15' },
            { label: 'Line ref.', value: 'LY-ORD-8812001' },
          ],
        },
      },
      {
        id: 'ly-a-2',
        listIcon: 'crown',
        title: 'Loyalty reward',
        amount: '+44.61 EXD',
        meta: ['Account: #12345678', 'Order: 8812002'],
        date: '10 Jan 2026',
        detail: {
          navTitle: 'Loyalty reward',
          chip: { text: 'Activated', tone: 'success' },
          heroIcon: 'crown',
          amount: '+44.61 EXD',
          details: [
            { label: 'Pack', value: 'Loyalty rewards · Jan 5–10' },
            { label: 'Credited to', value: 'Available rewards' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '8812002' },
            { label: 'Trading volume', value: '27.9 lots (period)' },
            { label: 'Posted on', value: '15 Jan 2026, 16:15' },
            { label: 'Line ref.', value: 'LY-ORD-8812002' },
          ],
        },
      },
    ],
  },
  'cashback-upcoming': {
    navTitle: 'Cashback',
    chip: { text: 'Upcoming', tone: 'warning' },
    heroIcon: 'dollar',
    amount: '+3.70 USD',
    details: [
      { label: 'Will be credited on', value: 'Tomorrow' },
      { label: 'For', value: 'Daily trading' },
    ],
    orders: [
      {
        id: 'cb-u-1',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 12345682'],
        date: 'Jan 15, 16:06',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Upcoming', tone: 'warning' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · daily session' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '12345682' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'USD leg (est.)', value: '+1.23 USD' },
            { label: 'Rate', value: '1 EXD = 1.185 USD' },
            { label: 'Conversion ref.', value: 'CB-CONV-1001' },
          ],
        },
      },
      {
        id: 'cb-u-2',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 12345683'],
        date: 'Jan 15, 16:06',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Upcoming', tone: 'warning' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · daily session' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '12345683' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'USD leg (est.)', value: '+1.23 USD' },
            { label: 'Rate', value: '1 EXD = 1.185 USD' },
            { label: 'Conversion ref.', value: 'CB-CONV-1002' },
          ],
        },
      },
      {
        id: 'cb-u-3',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 12345684'],
        date: 'Jan 15, 16:06',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Upcoming', tone: 'warning' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · daily session' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '12345684' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'USD leg (est.)', value: '+1.24 USD' },
            { label: 'Rate', value: '1 EXD = 1.185 USD' },
            { label: 'Conversion ref.', value: 'CB-CONV-1003' },
          ],
        },
      },
    ],
  },
  'cashback-activated': {
    navTitle: 'Cashback',
    chip: { text: 'Credited', tone: 'success' },
    heroIcon: 'dollar',
    amount: '+3.70 USD',
    details: [
      { label: 'Credited on', value: '14 Jan 2026, 16:06' },
      { label: 'For trading on', value: '13 Jan 2026' },
      { label: 'Account', value: '#12345678' },
    ],
    orders: [
      {
        id: 'cb-a-1',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 9130201'],
        date: '14 Jan 2026',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Credited', tone: 'success' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · 13 Jan 2026' },
            { label: 'Credited as', value: '+1.23 USD (batch)' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '9130201' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'Settled on', value: '14 Jan 2026, 16:06' },
            { label: 'Transaction ID', value: 'CB-91302-EX' },
          ],
        },
      },
      {
        id: 'cb-a-2',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 9130202'],
        date: '14 Jan 2026',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Credited', tone: 'success' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · 13 Jan 2026' },
            { label: 'Credited as', value: '+1.23 USD (batch)' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '9130202' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'Settled on', value: '14 Jan 2026, 16:06' },
            { label: 'Transaction ID', value: 'CB-91302-EX' },
          ],
        },
      },
      {
        id: 'cb-a-3',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 9130203'],
        date: '14 Jan 2026',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Credited', tone: 'success' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · 13 Jan 2026' },
            { label: 'Credited as', value: '+1.24 USD (batch)' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '9130203' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'Settled on', value: '14 Jan 2026, 16:06' },
            { label: 'Transaction ID', value: 'CB-91302-EX' },
          ],
        },
      },
    ],
  },
  'cashback-activated-jan12': {
    navTitle: 'Cashback',
    chip: { text: 'Credited', tone: 'success' },
    heroIcon: 'dollar',
    amount: '+3.70 USD',
    details: [
      { label: 'Credited on', value: '13 Jan 2026, 16:06' },
      { label: 'For trading on', value: '12 Jan 2026' },
      { label: 'Account', value: '#12345678' },
    ],
    orders: [
      {
        id: 'cb-j12-1',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 9088801'],
        date: '13 Jan 2026',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Credited', tone: 'success' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · 12 Jan 2026' },
            { label: 'Credited as', value: '+1.23 USD (batch)' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '9088801' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'Settled on', value: '13 Jan 2026, 16:06' },
            { label: 'Transaction ID', value: 'CB-90888-EX' },
          ],
        },
      },
      {
        id: 'cb-j12-2',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 9088802'],
        date: '13 Jan 2026',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Credited', tone: 'success' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · 12 Jan 2026' },
            { label: 'Credited as', value: '+1.23 USD (batch)' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '9088802' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'Settled on', value: '13 Jan 2026, 16:06' },
            { label: 'Transaction ID', value: 'CB-90888-EX' },
          ],
        },
      },
      {
        id: 'cb-j12-3',
        listIcon: 'exchange',
        title: 'EXD → Cashback',
        amount: '-1.04 EXD',
        amountClass: 'negative',
        meta: ['Account: #12345678', 'Order: 9088803'],
        date: '13 Jan 2026',
        detail: {
          navTitle: 'EXD → Cashback',
          chip: { text: 'Credited', tone: 'success' },
          heroIcon: 'dollar',
          amount: '-1.04 EXD',
          amountTone: 'negative',
          details: [
            { label: 'Pack', value: 'Cashback · 12 Jan 2026' },
            { label: 'Credited as', value: '+1.24 USD (batch)' },
            { label: 'Account', value: '#12345678' },
            { label: 'Order', value: '9088803' },
            { label: 'EXD debited', value: '1.04 EXD' },
            { label: 'Settled on', value: '13 Jan 2026, 16:06' },
            { label: 'Transaction ID', value: 'CB-90888-EX' },
          ],
        },
      },
    ],
  },
}

/** Демо: сколько ордеров в пачке (в проде придёт с API; для UI — отдельный sheet со скроллом). */
const ORDERS_DEMO_TOTAL = 200
/** Сколько последних ордеров показывать на главном экране пачки (тот же порядок, что и в полном списке). */
const ORDERS_PREVIEW_COUNT = 3

function cloneOrderWithOrderNumber(src: OrderInPack, id: string, orderNum: string): OrderInPack {
  const next = structuredClone(src) as OrderInPack
  next.id = id
  next.meta = [src.meta[0] ?? 'Account: #12345678', `Order: ${orderNum}`]
  next.detail = {
    ...next.detail,
    details: next.detail.details.map((row) => {
      if (row.label === 'Order') return { ...row, value: orderNum }
      if (row.label === 'Line ref.') return { ...row, value: `LY-ORD-${orderNum}` }
      if (row.label === 'Conversion ref.') return { ...row, value: `CB-CONV-${orderNum}` }
      return row
    }),
  }
  return next
}

function expandOrdersForDemo(
  orders: OrderInPack[],
  idPrefix: string,
  targetTotal: number = ORDERS_DEMO_TOTAL,
): OrderInPack[] {
  if (orders.length >= targetTotal) return orders
  const out = [...orders]
  let i = 0
  while (out.length < targetTotal) {
    const src = orders[i % orders.length]
    const orderNum = String(9100820 + out.length)
    out.push(cloneOrderWithOrderNumber(src, `${idPrefix}-more-${out.length}`, orderNum))
    i++
  }
  return out
}

const SIMPLE_CONFIG: Record<
  'transfer-exd' | 'promo-gift' | 'exd-adjustment',
  SimpleConfig
> = {
  'transfer-exd': {
    navTitle: 'Transfer',
    chip: { text: 'Completed', tone: 'neutral' },
    heroIcon: 'transfer',
    amount: '30.00 EXD',
    details: [
      { label: 'To account', value: '#1234678' },
      { label: 'From wallet', value: 'Available rewards' },
      { label: 'Initiated', value: '15 Jan 2026, 16:05' },
      { label: 'Completed', value: '15 Jan 2026, 16:06' },
      { label: 'Method', value: 'Instant transfer' },
      { label: 'Transfer ID', value: 'TRF-77821-EXD' },
    ],
  },
  'promo-gift': {
    navTitle: 'Birthday gift',
    chip: { text: 'Promo', tone: 'success' },
    heroIcon: 'gift',
    amount: '+50.00 EXD',
    details: [
      { label: 'Message', value: 'Best wishes! ✨' },
      { label: 'Campaign', value: 'Spring campaign 2026' },
      { label: 'Credited on', value: '19 Mar 2026, 16:15' },
      { label: 'Wallet', value: 'Available rewards' },
      { label: 'Eligibility', value: 'Active trader · Ultimate' },
      { label: 'Promo code', value: 'SPR26-EXNESS' },
      { label: 'Reference', value: 'PRM-GIFT-55218' },
    ],
  },
  'exd-adjustment': {
    navTitle: 'EXD adjustment',
    chip: { text: 'Adjustment', tone: 'negative' },
    heroIcon: 'crownOff',
    amount: '-0.40 EXD',
    amountTone: 'negative',
    details: [
      { label: 'Reason', value: 'Balance correction' },
      { label: 'Account', value: '#12345678' },
      { label: 'Processed on', value: '18 Mar 2026, 23:59' },
      { label: 'Wallet', value: 'Available rewards' },
      { label: 'Case reference', value: 'ADJ-2026-008812' },
      { label: 'Support ticket', value: '#SUP-441928' },
    ],
  },
}

function isPackVariant(v: RewardModalVariant): v is keyof typeof PACK_CONFIG {
  return (
    v === 'loyalty-upcoming' ||
    v === 'loyalty-activated' ||
    v === 'cashback-upcoming' ||
    v === 'cashback-activated' ||
    v === 'cashback-activated-jan12'
  )
}

function HeroIconEl({ kind }: { kind: HeroIcon }) {
  const common = { size: 28 as const, stroke: 1.75 as const, 'aria-hidden': true as const }
  switch (kind) {
    case 'crown':
      return <IconCrown {...common} />
    case 'dollar':
      return <IconCurrencyDollar {...common} />
    case 'transfer':
      return <IconArrowsRightLeft {...common} />
    case 'gift':
      return <IconGift {...common} />
    case 'crownOff':
      return <IconCrownOff {...common} />
    default:
      return null
  }
}

function OrderRowIconEl({ kind }: { kind: OrderRowIcon }) {
  const common = { size: 24 as const, stroke: 1.75 as const, 'aria-hidden': true as const }
  return kind === 'crown' ? <IconCrown {...common} /> : <IconArrowsExchange {...common} />
}

function chipClassFor(tone: ChipTone): string {
  switch (tone) {
    case 'warning':
      return styles.chipWarning
    case 'success':
      return styles.chipSuccess
    case 'negative':
      return styles.chipNegative
    default:
      return styles.chipNeutral
  }
}

function PackOrderRow({ order, onSelect }: { order: OrderInPack; onSelect: () => void }) {
  return (
    <button type="button" className={styles.orderRowBtn} onClick={onSelect}>
      <div className={styles.orderIcon}>
        <OrderRowIconEl kind={order.listIcon} />
      </div>
      <div className={styles.orderBody}>
        <div className={styles.orderHead}>
          <p className={styles.orderTitle}>{order.title}</p>
          <p
            className={
              order.amountClass === 'negative'
                ? `${styles.orderAmount} ${styles.orderAmountNegative}`
                : styles.orderAmount
            }
          >
            {order.amount}
          </p>
        </div>
        <div className={styles.orderDesc}>
          <div className={styles.orderMeta}>
            {order.meta.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className={styles.orderDate}>{order.date}</p>
        </div>
      </div>
    </button>
  )
}

export function RewardDetailModal({ variant, onClose, packOverride }: Props) {
  const [ordersSheetOpen, setOrdersSheetOpen] = useState(false)
  const [sheetOrderId, setSheetOrderId] = useState<string | null>(null)
  const ordersSheetTitleId = useId()

  const pack =
    isPackVariant(variant) && packOverride != null
      ? packOverride
      : isPackVariant(variant)
        ? PACK_CONFIG[variant]
        : null
  const simple = !pack ? SIMPLE_CONFIG[variant as keyof typeof SIMPLE_CONFIG] : null

  const allOrders = useMemo(() => {
    if (!pack) return []
    if (packOverride != null) return pack.orders
    return expandOrdersForDemo(pack.orders, String(variant), ORDERS_DEMO_TOTAL)
  }, [pack, packOverride, variant])

  const previewOrders = useMemo(
    () => allOrders.slice(-ORDERS_PREVIEW_COUNT),
    [allOrders],
  )

  const sheetOrder = sheetOrderId ? (allOrders.find((o) => o.id === sheetOrderId) ?? null) : null

  const openOrdersSheet = useCallback(() => {
    setOrdersSheetOpen(true)
  }, [])

  const openOrderInSheet = useCallback((orderId: string) => {
    setOrdersSheetOpen(true)
    setSheetOrderId(orderId)
  }, [])

  useEffect(() => {
    if (sheetOrderId && !sheetOrder) setSheetOrderId(null)
  }, [sheetOrderId, sheetOrder])

  const closeOrdersSheet = useCallback(() => {
    setOrdersSheetOpen(false)
    setSheetOrderId(null)
  }, [])

  const handleMainBackdrop = useCallback(() => {
    onClose()
  }, [onClose])

  useEffect(() => {
    setOrdersSheetOpen(false)
    setSheetOrderId(null)
  }, [variant, packOverride])

  useEffect(() => {
    const prev = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prev
    }
  }, [])

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== 'Escape') return
      if (sheetOrderId) {
        setSheetOrderId(null)
        return
      }
      if (ordersSheetOpen) {
        closeOrdersSheet()
        return
      }
      onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [closeOrdersSheet, onClose, ordersSheetOpen, sheetOrderId])

  const chipClass = chipClassFor(pack ? pack.chip.tone : simple!.chip.tone)

  const titleId = 'reward-detail-modal-title'
  const navTitle = pack ? pack.navTitle : simple!.navTitle

  const heroIcon: HeroIcon = pack ? pack.heroIcon : simple!.heroIcon
  const amount = pack ? pack.amount : simple!.amount
  const amountTone = pack ? pack.amountTone : simple!.amountTone
  const chipText = pack ? pack.chip.text : simple!.chip.text
  const detailRows = pack ? pack.details : simple!.details

  const handleOrdersBackdrop = useCallback(() => {
    if (sheetOrderId) setSheetOrderId(null)
    else closeOrdersSheet()
  }, [closeOrdersSheet, sheetOrderId])

  return (
    <div className={styles.root} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        onClick={handleMainBackdrop}
        aria-label="Close"
      />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
          <h2 className={styles.navTitle} id={titleId}>
            {navTitle}
          </h2>
          <span aria-hidden className={styles.headerSpacer} />
        </header>

        <div className={styles.scroll}>
          <div className={styles.hero}>
            <div className={styles.heroIcon}>
              <HeroIconEl kind={heroIcon} />
            </div>
            <p
              className={
                amountTone === 'negative'
                  ? `${styles.heroAmount} ${styles.heroAmountNegative}`
                  : styles.heroAmount
              }
            >
              {amount}
            </p>
            <span className={`${styles.chip} ${chipClass}`}>{chipText}</span>
          </div>

          <div className={styles.details}>
            {detailRows.map((row) => (
              <div key={row.label} className={styles.detailRow}>
                <p className={styles.detailLabel}>{row.label}</p>
                <p className={styles.detailValue}>{row.value}</p>
              </div>
            ))}
          </div>

          {pack ? (
            <section
              className={styles.ordersBlock}
              aria-label={`Last ${ORDERS_PREVIEW_COUNT} orders`}
            >
              <button
                type="button"
                className={styles.ordersNavRow}
                onClick={openOrdersSheet}
                aria-label={`Last ${ORDERS_PREVIEW_COUNT} orders, open full list`}
              >
                <h3 className={styles.ordersTitle}>
                  Last {ORDERS_PREVIEW_COUNT} orders
                </h3>
                <IconChevronRight className={styles.ordersChevron} size={24} stroke={2} aria-hidden />
              </button>
              {previewOrders.map((order) => (
                <PackOrderRow
                  key={order.id}
                  order={order}
                  onSelect={() => openOrderInSheet(order.id)}
                />
              ))}
            </section>
          ) : null}
        </div>
      </div>

      {ordersSheetOpen && pack ? (
        <div className={styles.ordersLayer} role="presentation">
          <button
            type="button"
            className={styles.ordersBackdrop}
            onClick={handleOrdersBackdrop}
            aria-label={sheetOrderId ? 'Back' : 'Close'}
          />
          <div
            className={styles.ordersPanel}
            role="dialog"
            aria-modal="true"
            aria-labelledby={ordersSheetTitleId}
          >
            {!sheetOrder ? (
              <>
                <header className={styles.header}>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={closeOrdersSheet}
                    aria-label="Back"
                  >
                    <IconChevronLeft size={24} stroke={2} aria-hidden />
                  </button>
                  <h2 className={styles.navTitle} id={ordersSheetTitleId}>
                    Orders
                  </h2>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={closeOrdersSheet}
                    aria-label="Close"
                  >
                    <IconX size={24} stroke={2} aria-hidden />
                  </button>
                </header>
                <div className={styles.ordersListScroll}>
                  {allOrders.map((order) => (
                    <PackOrderRow
                      key={order.id}
                      order={order}
                      onSelect={() => setSheetOrderId(order.id)}
                    />
                  ))}
                </div>
              </>
            ) : (
              <>
                <header className={styles.header}>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={() => setSheetOrderId(null)}
                    aria-label="Back"
                  >
                    <IconChevronLeft size={24} stroke={2} aria-hidden />
                  </button>
                  <h2 className={styles.navTitle} id={ordersSheetTitleId}>
                    {sheetOrder.detail.navTitle}
                  </h2>
                  <button
                    type="button"
                    className={styles.closeBtn}
                    onClick={closeOrdersSheet}
                    aria-label="Close"
                  >
                    <IconX size={24} stroke={2} aria-hidden />
                  </button>
                </header>
                <div className={styles.ordersListScroll}>
                  <div className={styles.hero}>
                    <div className={styles.heroIcon}>
                      <HeroIconEl kind={sheetOrder.detail.heroIcon} />
                    </div>
                    <p
                      className={
                        sheetOrder.detail.amountTone === 'negative'
                          ? `${styles.heroAmount} ${styles.heroAmountNegative}`
                          : styles.heroAmount
                      }
                    >
                      {sheetOrder.detail.amount}
                    </p>
                    <span
                      className={`${styles.chip} ${chipClassFor(sheetOrder.detail.chip.tone)}`}
                    >
                      {sheetOrder.detail.chip.text}
                    </span>
                  </div>
                  <div className={styles.details}>
                    {sheetOrder.detail.details.map((row) => (
                      <div key={row.label} className={styles.detailRow}>
                        <p className={styles.detailLabel}>{row.label}</p>
                        <p className={styles.detailValue}>{row.value}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}
    </div>
  )
}
