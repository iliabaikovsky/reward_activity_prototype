import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconChevronLeft, IconX } from '@tabler/icons-react'
import { AppH4 } from '../../ui/AppHeading'
import { ModalSheet } from '../../ui/ModalSheet'
import type { RewardModalVariant } from '../rewardModalTypes'
import {
  ORDERS_DEMO_TOTAL,
  ORDERS_PREVIEW_COUNT,
  PACK_CONFIG,
  SIMPLE_CONFIG,
  expandOrdersForDemo,
  isPackVariant,
  type PackConfig,
  type OrderInPack,
} from './configs'
import { DetailFieldList, DetailHero, chipClassFor } from './parts/DetailHero'
import { ClosedOrderSheet } from './parts/ClosedOrderSheet'
import { CashbackRateSheet } from './parts/CashbackRateSheet'
import { ExdCashbackDebitExplainerSheet } from './parts/ExdCashbackDebitExplainerSheet'
import { EXD_DEDUCTED_LABEL } from './configs/cashbackExdDebitExplainer'
import { CASHBACK_RATE_LABEL } from './configs/cashbackRateExplainer'
import { OrderDetailContent } from './parts/OrderDetailView'
import { PromoGiftCelebration } from './parts/PromoGiftCelebration'
import { OrdersListView } from './parts/OrdersListView'
import { OrdersSection } from './parts/OrdersSection'
import type { TradingOrderRegistry } from '../../../domain/reward/tradingOrder'
import { applyLinkedTradeDemoFallback, packAggregateKind, type AggregateKind, type CompanionAggregates } from '../../../rewardLifecycle/buildTradingOrderRegistry'
import {
  findPackOrderByTradingNum,
  ingestPackLegsIfMissing,
  type RewardOrderLeg,
} from '../../../rewardLifecycle/tradingOrderRegistry'
import styles from './RewardDetailModal.module.css'

export type { OrderInPack, PackConfig } from './configs'
export type { ChipTone, DetailRow, HeroIcon, OrderRowIcon } from '../../../domain/reward/types'

type PackModalRoute =
  | { screen: 'pack' }
  | { screen: 'orders' }
  | { screen: 'orderDetail'; orderId: string; from: 'pack' | 'orders' }

type ActiveAggregate = 'entry' | AggregateKind

export type RewardModalCloseReason = 'default' | 'switchedAggregate'

type Props = {
  variant: RewardModalVariant
  /** Stable id for reset when reopening another feed/upcoming row. */
  modalItemId?: string
  onClose: () => void
  /** Cross-type reward leg from closed order — parent should return home on modal Close. */
  onCrossTypeDrill?: () => void
  packOverride?: PackConfig | null
  tradingOrderRegistry?: TradingOrderRegistry
  /** Loyalty + cashback packs from simulator step — cross-type closed-order drill. */
  companionAggregates?: CompanionAggregates
  onOpenChart?: (orderNum: string) => void
}

export function RewardDetailModal({
  variant,
  modalItemId,
  onClose,
  onCrossTypeDrill,
  packOverride,
  tradingOrderRegistry = {},
  companionAggregates = { loyalty: null, cashback: null },
  onOpenChart,
}: Props) {
  const [route, setRoute] = useState<PackModalRoute>({ screen: 'pack' })
  const [activeAggregate, setActiveAggregate] = useState<ActiveAggregate>('entry')
  const [sheetOpen, setSheetOpen] = useState(true)
  const [closedOrderNum, setClosedOrderNum] = useState<string | null>(null)
  const [cashbackRateOpen, setCashbackRateOpen] = useState(false)
  const [exdDebitExplainerOpen, setExdDebitExplainerOpen] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const closeNotifiedRef = useRef(false)

  const entryPack =
    isPackVariant(variant) && packOverride != null
      ? packOverride
      : isPackVariant(variant)
        ? PACK_CONFIG[variant]
        : null
  const simple = !entryPack ? SIMPLE_CONFIG[variant as keyof typeof SIMPLE_CONFIG] : null

  const displayPack = useMemo(() => {
    if (!entryPack) return null
    if (activeAggregate === 'loyalty') return companionAggregates.loyalty ?? entryPack
    if (activeAggregate === 'cashback') return companionAggregates.cashback ?? entryPack
    return entryPack
  }, [activeAggregate, companionAggregates, entryPack])

  const entryAggregateKind = useMemo(
    () => (entryPack ? packAggregateKind(entryPack) : null),
    [entryPack],
  )

  const allOrders = useMemo(() => {
    if (!displayPack) return []
    if (packOverride != null && activeAggregate === 'entry') return packOverride.orders
    if (activeAggregate === 'loyalty' && companionAggregates.loyalty) {
      return companionAggregates.loyalty.orders
    }
    if (activeAggregate === 'cashback' && companionAggregates.cashback) {
      return companionAggregates.cashback.orders
    }
    return expandOrdersForDemo(displayPack.orders, String(variant), ORDERS_DEMO_TOTAL)
  }, [displayPack, packOverride, activeAggregate, companionAggregates, variant])

  const ordersForLegDrill = useMemo(() => {
    const byId = new Map<string, OrderInPack>()
    for (const order of [
      ...allOrders,
      ...(companionAggregates.loyalty?.orders ?? []),
      ...(companionAggregates.cashback?.orders ?? []),
    ]) {
      byId.set(order.id, order)
    }
    return [...byId.values()]
  }, [allOrders, companionAggregates])

  const previewOrders = useMemo(
    () => allOrders.slice(-ORDERS_PREVIEW_COUNT),
    [allOrders],
  )

  const selectedOrder = useMemo(() => {
    if (route.screen !== 'orderDetail') return null
    return ordersForLegDrill.find((o) => o.id === route.orderId) ?? null
  }, [ordersForLegDrill, route])

  const popRoute = useCallback(() => {
    setRoute((current) => {
      if (current.screen === 'orderDetail') {
        return current.from === 'orders' ? { screen: 'orders' } : { screen: 'pack' }
      }
      if (current.screen === 'orders') return { screen: 'pack' }
      return current
    })
  }, [])

  const notifyParentClose = useCallback(() => {
    if (closeNotifiedRef.current) return
    closeNotifiedRef.current = true
    onClose()
  }, [onClose])

  const requestSheetClose = useCallback(() => {
    setSheetOpen(false)
    notifyParentClose()
  }, [notifyParentClose])

  const handleSheetClosed = useCallback(() => {
    notifyParentClose()
  }, [notifyParentClose])

  const handleDismiss = useCallback(() => {
    if (route.screen !== 'pack') {
      popRoute()
      return
    }
    requestSheetClose()
  }, [popRoute, requestSheetClose, route.screen])

  useEffect(() => {
    closeNotifiedRef.current = false
    setActiveAggregate('entry')
    setRoute({ screen: 'pack' })
    setClosedOrderNum(null)
    setCashbackRateOpen(false)
    setExdDebitExplainerOpen(false)
    setSheetOpen(true)
  }, [variant, modalItemId])

  const registryForModal = useMemo(() => {
    const merged: TradingOrderRegistry = { ...tradingOrderRegistry }
    ingestPackLegsIfMissing(merged, displayPack)
    ingestPackLegsIfMissing(merged, companionAggregates.loyalty)
    ingestPackLegsIfMissing(merged, companionAggregates.cashback)
    applyLinkedTradeDemoFallback(merged)
    return merged
  }, [tradingOrderRegistry, displayPack, companionAggregates])

  const closedOrderRewards = useMemo(() => {
    if (!closedOrderNum) return undefined
    return registryForModal[closedOrderNum]
  }, [closedOrderNum, registryForModal])

  const closedOrderLegDrill = useMemo(() => {
    if (!closedOrderNum) {
      return { exdEarned: false, cashback: false }
    }
    return {
      exdEarned: Boolean(
        findPackOrderByTradingNum(ordersForLegDrill, closedOrderNum, 'exdEarned'),
      ),
      cashback: Boolean(
        findPackOrderByTradingNum(ordersForLegDrill, closedOrderNum, 'cashbackFromExd'),
      ),
    }
  }, [closedOrderNum, ordersForLegDrill])

  const openRewardLegFromClosedOrder = useCallback(
    (leg: RewardOrderLeg) => {
      if (!closedOrderNum) return
      const target = findPackOrderByTradingNum(ordersForLegDrill, closedOrderNum, leg)
      if (!target) return

      const targetKind: AggregateKind = leg === 'exdEarned' ? 'loyalty' : 'cashback'
      const currentKind: AggregateKind | null =
        activeAggregate === 'entry' ? entryAggregateKind : activeAggregate
      const isCrossType = currentKind != null && targetKind !== currentKind

      if (isCrossType) {
        onCrossTypeDrill?.()
        setActiveAggregate(targetKind)
        setRoute({ screen: 'orderDetail', orderId: target.id, from: 'pack' })
      } else {
        const from =
          route.screen === 'orderDetail'
            ? route.from
            : route.screen === 'orders'
              ? 'orders'
              : 'pack'
        setRoute({ screen: 'orderDetail', orderId: target.id, from })
      }

      requestAnimationFrame(() => setClosedOrderNum(null))
    },
    [ordersForLegDrill, closedOrderNum, route, activeAggregate, entryAggregateKind, onCrossTypeDrill],
  )

  const isCashbackLegOrder =
    selectedOrder?.legMode === 'upcoming' ||
    selectedOrder?.legMode === 'credited' ||
    selectedOrder?.title === 'EXD → Cashback'

  const showExdDebitedExplainer =
    (selectedOrder?.legMode === 'upcoming' || selectedOrder?.legMode === 'credited') &&
    selectedOrder.detail.details.some((r) => r.label === EXD_DEDUCTED_LABEL && r.infoIcon)

  const showCashbackRateExplainer =
    isCashbackLegOrder &&
    selectedOrder?.detail.details.some((r) => r.label === CASHBACK_RATE_LABEL && r.infoIcon)

  const openExdDebitedExplainer = useCallback(() => {
    setExdDebitExplainerOpen(true)
  }, [])

  const openCashbackRateExplainer = useCallback(() => {
    setCashbackRateOpen(true)
  }, [])

  useEffect(() => {
    if (route.screen === 'orderDetail' && !selectedOrder) {
      setRoute({ screen: 'pack' })
    }
  }, [route, selectedOrder])

  const openOrders = useCallback(() => {
    setRoute({ screen: 'orders' })
  }, [])

  const openOrderFromPack = useCallback((orderId: string) => {
    setRoute({ screen: 'orderDetail', orderId, from: 'pack' })
  }, [])

  const openOrderFromList = useCallback((orderId: string) => {
    setRoute({ screen: 'orderDetail', orderId, from: 'orders' })
  }, [])

  const handleEdgeTouchStart = useCallback((e: React.TouchEvent) => {
    const touch = e.touches[0]
    if (!touch || touch.clientX > 24) return
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }, [])

  const handleEdgeTouchEnd = useCallback(
    (e: React.TouchEvent) => {
      const start = touchStartRef.current
      touchStartRef.current = null
      if (!start || route.screen === 'pack') return

      const touch = e.changedTouches[0]
      if (!touch) return

      const dx = touch.clientX - start.x
      const dy = Math.abs(touch.clientY - start.y)
      if (dx > 48 && dy < 80) popRoute()
    },
    [popRoute, route.screen],
  )

  const chipClass = chipClassFor(
    displayPack ? displayPack.chip.tone : simple!.chip.tone,
    styles,
  )
  const titleId = 'reward-detail-modal-title'

  const navTitle =
    route.screen === 'orders'
      ? 'Orders'
      : route.screen === 'orderDetail' && selectedOrder
        ? selectedOrder.detail.navTitle
        : displayPack
          ? displayPack.navTitle
          : simple!.navTitle

  const navContentClass =
    route.screen === 'pack'
      ? styles.navContent
      : `${styles.navContent} ${styles.navContentPushed}`

  return (
    <ModalSheet
      open={sheetOpen}
      onClose={handleSheetClosed}
      onScrimDismiss={requestSheetClose}
      scrimDismissEnabled={
        closedOrderNum == null &&
        !cashbackRateOpen &&
        !exdDebitExplainerOpen
      }
      titleId={titleId}
      detent="large"
      escapeEnabled={
        closedOrderNum == null &&
        !cashbackRateOpen &&
        !exdDebitExplainerOpen
      }
      onEscape={handleDismiss}
    >
      <div
        className={styles.sheetBody}
        onTouchStart={handleEdgeTouchStart}
        onTouchEnd={handleEdgeTouchEnd}
      >
        <header className={styles.header} data-screenshot="reward-modal-header">
          {route.screen === 'pack' ? (
            <button type="button" className={styles.closeBtn} onClick={requestSheetClose} aria-label="Close">
              <IconX size={24} stroke={2} aria-hidden />
            </button>
          ) : (
            <button type="button" className={styles.closeBtn} onClick={popRoute} aria-label="Back">
              <IconChevronLeft size={24} stroke={2} aria-hidden />
            </button>
          )}
          <AppH4 className={styles.navTitle} id={titleId}>
            {navTitle}
          </AppH4>
          <span aria-hidden className={styles.headerSpacer} />
        </header>

        <div className={styles.navViewport}>
          <div key={route.screen === 'orderDetail' ? route.orderId : route.screen} className={navContentClass}>
            {route.screen === 'pack' && (
              <div className={styles.scroll}>
                <DetailHero
                  heroIcon={displayPack ? displayPack.heroIcon : simple!.heroIcon}
                  amount={displayPack ? displayPack.amount : simple!.amount}
                  amountTone={displayPack ? displayPack.amountTone : simple!.amountTone}
                  chipText={displayPack ? displayPack.chip.text : simple!.chip.text}
                  chipClass={chipClass}
                />
                <DetailFieldList rows={displayPack ? displayPack.details : simple!.details} />

                {simple?.celebration ? (
                  <PromoGiftCelebration
                    message={simple.celebration.message}
                    imageAlt={simple.celebration.imageAlt}
                  />
                ) : null}

                {displayPack ? (
                  <OrdersSection
                    previewOrders={previewOrders}
                    onOpenFullList={openOrders}
                    onSelectOrder={openOrderFromPack}
                    sectionTitle={displayPack.heroIcon === 'dollar' ? 'Cashback' : 'Rewards'}
                  />
                ) : null}
              </div>
            )}

            {route.screen === 'orders' && displayPack ? (
              <OrdersListView allOrders={allOrders} onSelectOrder={openOrderFromList} />
            ) : null}

            {route.screen === 'orderDetail' && selectedOrder ? (
              <OrderDetailContent
                order={selectedOrder}
                onOrderClick={setClosedOrderNum}
                onExdDebitedClick={showExdDebitedExplainer ? openExdDebitedExplainer : undefined}
                onCashbackRateClick={
                  showCashbackRateExplainer ? openCashbackRateExplainer : undefined
                }
              />
            ) : null}
          </div>
        </div>
      </div>

      <ClosedOrderSheet
        open={closedOrderNum != null}
        orderNum={closedOrderNum ?? ''}
        rewards={closedOrderRewards}
        onClose={() => setClosedOrderNum(null)}
        onOpenExdEarned={
          closedOrderLegDrill.exdEarned
            ? () => openRewardLegFromClosedOrder('exdEarned')
            : undefined
        }
        onOpenCashback={
          closedOrderLegDrill.cashback
            ? () => openRewardLegFromClosedOrder('cashbackFromExd')
            : undefined
        }
        onOpenChart={onOpenChart}
      />

      <CashbackRateSheet
        open={cashbackRateOpen}
        onClose={() => setCashbackRateOpen(false)}
      />

      <ExdCashbackDebitExplainerSheet
        open={exdDebitExplainerOpen}
        onClose={() => setExdDebitExplainerOpen(false)}
      />
    </ModalSheet>
  )
}
