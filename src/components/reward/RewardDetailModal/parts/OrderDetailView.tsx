import { IconChevronLeft, IconX } from '@tabler/icons-react'
import { DetailFieldList, DetailHero, chipClassFor } from './DetailHero'
import { PackOrderRow } from './OrdersSection'
import type { OrderInPack } from '../configs/types'
import styles from '../RewardDetailModal.module.css'

type Props = {
  titleId: string
  allOrders: OrderInPack[]
  sheetOrder: OrderInPack | null
  onBackFromOrder: () => void
  onClose: () => void
  onSelectOrder: (orderId: string) => void
}

export function OrdersSheetContent({
  titleId,
  allOrders,
  sheetOrder,
  onBackFromOrder,
  onClose,
  onSelectOrder,
}: Props) {
  if (!sheetOrder) {
    return (
      <>
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Back">
            <IconChevronLeft size={24} stroke={2} aria-hidden />
          </button>
          <h2 className={styles.navTitle} id={titleId}>
            Orders
          </h2>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
        </header>
        <div className={styles.ordersListScroll}>
          {allOrders.map((order) => (
            <PackOrderRow key={order.id} order={order} onSelect={() => onSelectOrder(order.id)} />
          ))}
        </div>
      </>
    )
  }

  return (
    <>
      <header className={styles.header}>
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onBackFromOrder}
          aria-label="Back"
        >
          <IconChevronLeft size={24} stroke={2} aria-hidden />
        </button>
        <h2 className={styles.navTitle} id={titleId}>
          {sheetOrder.detail.navTitle}
        </h2>
        <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
          <IconX size={24} stroke={2} aria-hidden />
        </button>
      </header>
      <div className={styles.ordersListScroll}>
        <DetailHero
          heroIcon={sheetOrder.detail.heroIcon}
          amount={sheetOrder.detail.amount}
          amountTone={sheetOrder.detail.amountTone}
          chipText={sheetOrder.detail.chip.text}
          chipClass={chipClassFor(sheetOrder.detail.chip.tone, styles)}
        />
        <DetailFieldList rows={sheetOrder.detail.details} />
      </div>
    </>
  )
}
