import { useMemo, useState } from 'react'
import type { OrderInPack } from '../configs/types'
import { buildMonthFilterOptions, filterOrders, groupOrdersByMonth } from '../orderListUtils'
import { PackOrderRow } from './OrdersSection'
import styles from './OrdersListView.module.css'

type Props = {
  allOrders: OrderInPack[]
  onSelectOrder: (orderId: string) => void
}

export function OrdersListView({ allOrders, onSelectOrder }: Props) {
  const [query, setQuery] = useState('')
  const [monthId, setMonthId] = useState('all')

  const monthOptions = useMemo(() => buildMonthFilterOptions(allOrders), [allOrders])

  const filteredOrders = useMemo(
    () => filterOrders(allOrders, { query, monthId }),
    [allOrders, query, monthId],
  )

  const groups = useMemo(() => groupOrdersByMonth(filteredOrders), [filteredOrders])

  return (
    <div className={styles.root}>
      <div className={styles.searchWrap}>
        <input
          type="search"
          className={styles.searchInput}
          placeholder="Search orders"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          aria-label="Search orders"
        />
      </div>

      {monthOptions.length > 1 ? (
        <div className={styles.chipsRow} role="group" aria-label="Filter by month">
          {monthOptions.map((opt) => (
            <button
              key={opt.id}
              type="button"
              className={`${styles.chip} ${monthId === opt.id ? styles.chipActive : ''}`}
              onClick={() => setMonthId(opt.id)}
              aria-pressed={monthId === opt.id}
            >
              {opt.label}
            </button>
          ))}
        </div>
      ) : null}

      <div className={styles.listScroll}>
        {groups.length === 0 ? (
          <p className={styles.emptyState}>No orders match your search.</p>
        ) : (
          groups.map((group) => (
            <section key={group.monthId} aria-label={group.monthLabel}>
              <h3 className={styles.sectionHeader}>{group.monthLabel}</h3>
              {group.orders.map((order) => (
                <PackOrderRow
                  key={order.id}
                  order={order}
                  onSelect={() => onSelectOrder(order.id)}
                />
              ))}
            </section>
          ))
        )}
      </div>
    </div>
  )
}
