import { IconChevronRight } from '@tabler/icons-react'
import { OrderRowIcon as OrderRowIconComponent } from '../../../ui/RewardEventIcon'
import type { OrderInPack } from '../configs/types'
import styles from '../RewardDetailModal.module.css'

export function PackOrderRow({
  order,
  onSelect,
}: {
  order: OrderInPack
  onSelect: () => void
}) {
  return (
    <button type="button" className={styles.orderRowBtn} onClick={onSelect}>
      <div className={styles.orderIcon}>
        <OrderRowIconComponent kind={order.listIcon} />
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

export function OrdersSection({
  previewCount,
  previewOrders,
  onOpenFullList,
  onSelectOrder,
}: {
  previewCount: number
  previewOrders: OrderInPack[]
  onOpenFullList: () => void
  onSelectOrder: (orderId: string) => void
}) {
  return (
    <section className={styles.ordersBlock} aria-label={`Last ${previewCount} orders`}>
      <button
        type="button"
        className={styles.ordersNavRow}
        onClick={onOpenFullList}
        aria-label={`Last ${previewCount} orders, open full list`}
      >
        <h3 className={styles.ordersTitle}>Last {previewCount} orders</h3>
        <IconChevronRight className={styles.ordersChevron} size={24} stroke={2} aria-hidden />
      </button>
      {previewOrders.map((order) => (
        <PackOrderRow key={order.id} order={order} onSelect={() => onSelectOrder(order.id)} />
      ))}
    </section>
  )
}
