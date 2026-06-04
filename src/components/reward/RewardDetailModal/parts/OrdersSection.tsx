import { formatListDateTimeLoose } from '../../../../domain/reward/formatListDateTime'
import { BoosterBadge } from '../../../ui/BoosterBadge'
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
          <div className={styles.orderTitleRow}>
            <p className={styles.orderTitle}>{order.title}</p>
            {order.listBoosterBadge ? (
              <BoosterBadge variant="multiplier">{order.listBoosterBadge}</BoosterBadge>
            ) : null}
          </div>
          <p className={styles.orderAmount}>{order.amount}</p>
        </div>
        <div className={styles.orderDesc}>
          <div className={styles.orderMeta}>
            {order.meta.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className={styles.orderDate}>{formatListDateTimeLoose(order.date)}</p>
        </div>
      </div>
    </button>
  )
}

export function OrdersSection({
  previewOrders,
  onOpenFullList,
  onSelectOrder,
  sectionTitle = 'Last orders',
}: {
  previewOrders: OrderInPack[]
  onOpenFullList: () => void
  onSelectOrder: (orderId: string) => void
  sectionTitle?: string
}) {
  return (
    <section className={styles.ordersBlock} aria-label={sectionTitle}>
      <button
        type="button"
        className={styles.ordersNavRow}
        onClick={onOpenFullList}
        aria-label={`${sectionTitle}, see all`}
      >
        <h3 className={styles.ordersTitle}>{sectionTitle}</h3>
        <span className={styles.ordersSeeAll}>See all</span>
      </button>
      {previewOrders.map((order) => (
        <PackOrderRow key={order.id} order={order} onSelect={() => onSelectOrder(order.id)} />
      ))}
    </section>
  )
}
