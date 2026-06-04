import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { IconChevronLeft, IconX } from '@tabler/icons-react'
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
} from './configs'
import { DetailFieldList, DetailHero, chipClassFor } from './parts/DetailHero'
import { EARNING_RATE_VALUE } from './configs/loyaltyOrderDetailRows'
import { ClosedOrderSheet } from './parts/ClosedOrderSheet'
import { EarningRateSheet } from './parts/EarningRateSheet'
import { CashbackCalculationSheet } from './parts/CashbackCalculationSheet'
import { ExdCashbackDebitExplainerSheet } from './parts/ExdCashbackDebitExplainerSheet'
import { EXD_DEBITED_LABEL } from './configs/cashbackExdDebitExplainer'
import { RebateShareSheet } from './parts/RebateShareSheet'
import { RewardCalculationSheet } from './parts/RewardCalculationSheet'
import { OrderDetailContent } from './parts/OrderDetailView'
import { OrdersListView } from './parts/OrdersListView'
import { OrdersSection } from './parts/OrdersSection'
import type { TradingOrderRegistry } from '../../../domain/reward/tradingOrder'
import { buildCashbackRebateCalculation } from '../../../domain/reward/cashbackRebateCalculation'
import { buildLoyaltyRewardCalculation } from '../../../domain/reward/loyaltyRewardCalculation'
import {
  ingestPackIntoRegistry,
  parseTradingOrderNum,
} from '../../../rewardLifecycle/tradingOrderRegistry'
import { CALCULATION_ROW_LABEL } from './configs/rewardCalculationExplainer'
import styles from './RewardDetailModal.module.css'

export type { OrderInPack, PackConfig } from './configs'
export type { ChipTone, DetailRow, HeroIcon, OrderRowIcon } from '../../../domain/reward/types'

type PackModalRoute =
  | { screen: 'pack' }
  | { screen: 'orders' }
  | { screen: 'orderDetail'; orderId: string; from: 'pack' | 'orders' }

type Props = {
  variant: RewardModalVariant
  onClose: () => void
  packOverride?: PackConfig | null
  tradingOrderRegistry?: TradingOrderRegistry
}

export function RewardDetailModal({
  variant,
  onClose,
  packOverride,
  tradingOrderRegistry = {},
}: Props) {
  const [route, setRoute] = useState<PackModalRoute>({ screen: 'pack' })
  const [sheetOpen, setSheetOpen] = useState(true)
  const [closedOrderNum, setClosedOrderNum] = useState<string | null>(null)
  const [earningRateOpen, setEarningRateOpen] = useState(false)
  const [calculationKind, setCalculationKind] = useState<'loyalty' | 'cashback' | null>(null)
  const [rebateShareOpen, setRebateShareOpen] = useState(false)
  const [exdDebitExplainerOpen, setExdDebitExplainerOpen] = useState(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)

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

  const selectedOrder = useMemo(() => {
    if (route.screen !== 'orderDetail') return null
    return allOrders.find((o) => o.id === route.orderId) ?? null
  }, [allOrders, route])

  const popRoute = useCallback(() => {
    setRoute((current) => {
      if (current.screen === 'orderDetail') {
        return current.from === 'orders' ? { screen: 'orders' } : { screen: 'pack' }
      }
      if (current.screen === 'orders') return { screen: 'pack' }
      return current
    })
  }, [])

  const requestSheetClose = useCallback(() => {
    setSheetOpen(false)
  }, [])

  const handleDismiss = useCallback(() => {
    if (route.screen !== 'pack') {
      popRoute()
      return
    }
    requestSheetClose()
  }, [popRoute, requestSheetClose, route.screen])

  useEffect(() => {
    setRoute({ screen: 'pack' })
    setClosedOrderNum(null)
    setEarningRateOpen(false)
    setCalculationKind(null)
    setRebateShareOpen(false)
    setExdDebitExplainerOpen(false)
    setSheetOpen(true)
  }, [variant, packOverride])

  const registryForModal = useMemo(() => {
    if (packOverride != null) {
      const merged: TradingOrderRegistry = { ...tradingOrderRegistry }
      ingestPackIntoRegistry(merged, packOverride)
      return merged
    }
    const merged: TradingOrderRegistry = { ...tradingOrderRegistry }
    if (pack) ingestPackIntoRegistry(merged, pack)
    return merged
  }, [tradingOrderRegistry, pack, packOverride, variant])

  const closedOrderRewards = useMemo(() => {
    if (!closedOrderNum) return undefined
    return registryForModal[closedOrderNum]
  }, [closedOrderNum, registryForModal])

  const openClosedOrder = useCallback((orderNum: string) => {
    setClosedOrderNum(orderNum)
  }, [])

  const openEarningRate = useCallback(() => {
    setEarningRateOpen(true)
  }, [])

  const earningRateValue = useMemo(() => {
    if (!selectedOrder) return EARNING_RATE_VALUE
    const row = selectedOrder.detail.details.find((r) => r.label === 'Earning rate')
    return row?.value ?? EARNING_RATE_VALUE
  }, [selectedOrder])

  const showEarningRateExplainer =
    selectedOrder?.title === 'Loyalty reward' &&
    selectedOrder.detail.details.some((r) => r.label === 'Earning rate' && r.infoIcon)

  const isCashbackLegOrder =
    selectedOrder?.legMode === 'upcoming' ||
    selectedOrder?.legMode === 'credited' ||
    selectedOrder?.title === 'EXD → Cashback'

  const showExdDebitedExplainer =
    (selectedOrder?.legMode === 'upcoming' || selectedOrder?.legMode === 'credited') &&
    selectedOrder.detail.details.some((r) => r.label === EXD_DEBITED_LABEL && r.infoIcon)

  const showCalculationExplainer =
    (selectedOrder?.title === 'Loyalty reward' || isCashbackLegOrder) &&
    (selectedOrder?.detail.details.some(
      (r) => r.label === CALCULATION_ROW_LABEL && r.chevron,
    ) ??
      false)

  const openCalculationForOrder = useCallback(() => {
    if (selectedOrder?.title === 'Loyalty reward') {
      setCalculationKind('loyalty')
    } else if (isCashbackLegOrder) {
      setCalculationKind('cashback')
    }
  }, [selectedOrder?.title, isCashbackLegOrder])

  const openExdDebitedExplainer = useCallback(() => {
    setExdDebitExplainerOpen(true)
  }, [])

  const loyaltyCalculation = useMemo(() => {
    if (!selectedOrder || selectedOrder.title !== 'Loyalty reward') return null
    const details = selectedOrder.detail.details
    const orderNum =
      parseTradingOrderNum(selectedOrder) ??
      details.find((r) => r.label === 'Order')?.value ??
      ''
    const account = details.find((r) => r.label === 'Account')?.value ?? ''
    const rateRow =
      details.find((r) => r.label === 'Earning rate')?.value ?? EARNING_RATE_VALUE
    const boosterValue = details.find((r) => r.label === 'Booster')?.value ?? ''

    return buildLoyaltyRewardCalculation({
      amountExd: selectedOrder.detail.amount,
      orderNum,
      account,
      earningRateValue: rateRow,
      boosterValue,
      rewards: orderNum ? registryForModal[orderNum] : undefined,
    })
  }, [selectedOrder, registryForModal])

  const cashbackCalculation = useMemo(() => {
    if (!selectedOrder || !isCashbackLegOrder) return null
    const orderNum =
      parseTradingOrderNum(selectedOrder) ??
      selectedOrder.detail.details.find((r) => r.label === 'Order')?.value ??
      ''
    const exdRow = selectedOrder.detail.details.find((r) => r.label === EXD_DEBITED_LABEL)
    const amountExd =
      (selectedOrder.legMode === 'upcoming' || selectedOrder.legMode === 'credited') && exdRow
        ? exdRow.value
        : selectedOrder.detail.amount

    return buildCashbackRebateCalculation({
      amountExd,
      cashbackUsdLeg: selectedOrder.cashbackUsdLeg,
      orderNum,
      packCredited: pack?.chip.text === 'Credited',
      rewards: orderNum ? registryForModal[orderNum] : undefined,
    })
  }, [selectedOrder, isCashbackLegOrder, pack?.chip.text, registryForModal])

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

  const chipClass = chipClassFor(pack ? pack.chip.tone : simple!.chip.tone, styles)
  const titleId = 'reward-detail-modal-title'

  const navTitle =
    route.screen === 'orders'
      ? 'Orders'
      : route.screen === 'orderDetail' && selectedOrder
        ? selectedOrder.detail.navTitle
        : pack
          ? pack.navTitle
          : simple!.navTitle

  const navContentClass =
    route.screen === 'pack'
      ? styles.navContent
      : `${styles.navContent} ${styles.navContentPushed}`

  return (
    <ModalSheet
      open={sheetOpen}
      onClose={onClose}
      onScrimDismiss={requestSheetClose}
      titleId={titleId}
      detent="large"
      escapeEnabled={
        closedOrderNum == null &&
        !earningRateOpen &&
        calculationKind == null &&
        !rebateShareOpen &&
        !exdDebitExplainerOpen
      }
      onEscape={handleDismiss}
    >
      <div
        className={styles.sheetBody}
        onTouchStart={handleEdgeTouchStart}
        onTouchEnd={handleEdgeTouchEnd}
      >
        <header className={styles.header}>
          {route.screen === 'pack' ? (
            <button type="button" className={styles.closeBtn} onClick={requestSheetClose} aria-label="Close">
              <IconX size={24} stroke={2} aria-hidden />
            </button>
          ) : (
            <button type="button" className={styles.closeBtn} onClick={popRoute} aria-label="Back">
              <IconChevronLeft size={24} stroke={2} aria-hidden />
            </button>
          )}
          <h2 className={styles.navTitle} id={titleId}>
            {navTitle}
          </h2>
          <span aria-hidden className={styles.headerSpacer} />
        </header>

        <div className={styles.navViewport}>
          <div key={route.screen === 'orderDetail' ? route.orderId : route.screen} className={navContentClass}>
            {route.screen === 'pack' && (
              <div className={styles.scroll}>
                <DetailHero
                  heroIcon={pack ? pack.heroIcon : simple!.heroIcon}
                  amount={pack ? pack.amount : simple!.amount}
                  amountTone={pack ? pack.amountTone : simple!.amountTone}
                  chipText={pack ? pack.chip.text : simple!.chip.text}
                  chipClass={chipClass}
                />
                <DetailFieldList rows={pack ? pack.details : simple!.details} />

                {pack ? (
                  <OrdersSection
                    previewOrders={previewOrders}
                    onOpenFullList={openOrders}
                    onSelectOrder={openOrderFromPack}
                    sectionTitle={
                      variant === 'cashback-upcoming' ||
                      variant === 'cashback-activated' ||
                      variant === 'cashback-activated-jan12'
                        ? 'Orders'
                        : 'Last orders'
                    }
                  />
                ) : null}
              </div>
            )}

            {route.screen === 'orders' && pack ? (
              <OrdersListView allOrders={allOrders} onSelectOrder={openOrderFromList} />
            ) : null}

            {route.screen === 'orderDetail' && selectedOrder ? (
              <OrderDetailContent
                order={selectedOrder}
                onOrderClick={openClosedOrder}
                onEarningRateClick={showEarningRateExplainer ? openEarningRate : undefined}
                onExdDebitedClick={showExdDebitedExplainer ? openExdDebitedExplainer : undefined}
                onCalculationClick={showCalculationExplainer ? openCalculationForOrder : undefined}
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
        onRewardsBack={() => setClosedOrderNum(null)}
      />

      <EarningRateSheet
        open={earningRateOpen}
        rateValue={earningRateValue}
        onClose={() => setEarningRateOpen(false)}
      />

      <RewardCalculationSheet
        open={calculationKind === 'loyalty'}
        calculation={loyaltyCalculation}
        onClose={() => setCalculationKind(null)}
        onEarningRateClick={showEarningRateExplainer ? openEarningRate : undefined}
      />

      <CashbackCalculationSheet
        open={calculationKind === 'cashback'}
        calculation={cashbackCalculation}
        onClose={() => setCalculationKind(null)}
        onRebateShareClick={() => setRebateShareOpen(true)}
      />

      <RebateShareSheet
        open={rebateShareOpen}
        sharePercent={cashbackCalculation?.rebateSharePercent ?? 50}
        maxSharePercent={cashbackCalculation?.maxSharePercent ?? 50}
        onClose={() => setRebateShareOpen(false)}
      />

      <ExdCashbackDebitExplainerSheet
        open={exdDebitExplainerOpen}
        onClose={() => setExdDebitExplainerOpen(false)}
      />
    </ModalSheet>
  )
}
