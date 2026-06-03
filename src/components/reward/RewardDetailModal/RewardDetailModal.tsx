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
import { OrderDetailContent } from './parts/OrderDetailView'
import { OrdersListView } from './parts/OrdersListView'
import { OrdersSection } from './parts/OrdersSection'
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
}

export function RewardDetailModal({ variant, onClose, packOverride }: Props) {
  const [route, setRoute] = useState<PackModalRoute>({ screen: 'pack' })
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

  const handleDismiss = useCallback(() => {
    if (route.screen !== 'pack') {
      popRoute()
      return
    }
    onClose()
  }, [onClose, popRoute, route.screen])

  useEffect(() => {
    setRoute({ screen: 'pack' })
  }, [variant, packOverride])

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
      open
      onClose={handleDismiss}
      onScrimDismiss={onClose}
      titleId={titleId}
      detent="large"
    >
      <div
        className={styles.sheetBody}
        onTouchStart={handleEdgeTouchStart}
        onTouchEnd={handleEdgeTouchEnd}
      >
        <header className={styles.header}>
          {route.screen === 'pack' ? (
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
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
                  />
                ) : null}
              </div>
            )}

            {route.screen === 'orders' && pack ? (
              <OrdersListView allOrders={allOrders} onSelectOrder={openOrderFromList} />
            ) : null}

            {route.screen === 'orderDetail' && selectedOrder ? (
              <OrderDetailContent order={selectedOrder} />
            ) : null}
          </div>
        </div>
      </div>
    </ModalSheet>
  )
}
