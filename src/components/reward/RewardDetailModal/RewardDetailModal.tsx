import { useCallback, useEffect, useId, useMemo, useState } from 'react'
import { IconX } from '@tabler/icons-react'
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
import { OrdersSection } from './parts/OrdersSection'
import { OrdersSheetContent } from './parts/OrderDetailView'
import styles from './RewardDetailModal.module.css'

export type { OrderInPack, PackConfig } from './configs'
export type { ChipTone, DetailRow, HeroIcon, OrderRowIcon } from '../../../domain/reward/types'

type Props = {
  variant: RewardModalVariant
  onClose: () => void
  packOverride?: PackConfig | null
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

  const chipClass = chipClassFor(pack ? pack.chip.tone : simple!.chip.tone, styles)
  const titleId = 'reward-detail-modal-title'
  const navTitle = pack ? pack.navTitle : simple!.navTitle
  const heroIcon = pack ? pack.heroIcon : simple!.heroIcon
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
        onClick={onClose}
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
          <DetailHero
            heroIcon={heroIcon}
            amount={amount}
            amountTone={amountTone}
            chipText={chipText}
            chipClass={chipClass}
          />
          <DetailFieldList rows={detailRows} />

          {pack ? (
            <OrdersSection
              previewCount={ORDERS_PREVIEW_COUNT}
              previewOrders={previewOrders}
              onOpenFullList={openOrdersSheet}
              onSelectOrder={openOrderInSheet}
            />
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
            <OrdersSheetContent
              titleId={ordersSheetTitleId}
              allOrders={allOrders}
              sheetOrder={sheetOrder}
              onBackFromOrder={() => setSheetOrderId(null)}
              onClose={closeOrdersSheet}
              onSelectOrder={setSheetOrderId}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}
