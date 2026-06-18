import { useMemo, useState } from 'react'
import { ALL_TIME_DATE_RANGE, type DateRangeFilter } from '../../../../domain/reward/dateRangeFilter'
import { DateRangeFilterChip } from '../../../ui/DateRangeFilterChip'
import { DateRangeFilterSheet } from '../../../ui/DateRangeFilterSheet'
import type { OrderInPack } from '../configs/types'
import { filterOrders, groupOrdersByMonth } from '../orderListUtils'
import { PackOrderRow } from './OrdersSection'
import styles from './OrdersListView.module.css'

type Props = {
  allOrders: OrderInPack[]
  onSelectOrder: (orderId: string) => void
}

export function OrdersListView({ allOrders, onSelectOrder }: Props) {
  const [dateRange, setDateRange] = useState<DateRangeFilter>(ALL_TIME_DATE_RANGE)
  const [dateSheetOpen, setDateSheetOpen] = useState(false)

  const filteredOrders = useMemo(
    () => filterOrders(allOrders, dateRange),
    [allOrders, dateRange],
  )

  const groups = useMemo(() => groupOrdersByMonth(filteredOrders), [filteredOrders])

  return (
    <div className={styles.root}>
      <div className={styles.filterWrap}>
        <DateRangeFilterChip
          value={dateRange}
          onClick={() => setDateSheetOpen(true)}
          expanded={dateSheetOpen}
        />
      </div>

      <div className={styles.listScroll}>
        {groups.length === 0 ? (
          <p className={styles.emptyState}>No orders in this period.</p>
        ) : (
          groups.map((group) => (
            <section key={group.monthId} aria-label={group.monthLabel}>
              <p className={styles.sectionHeader}>{group.monthLabel}</p>
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

      <DateRangeFilterSheet
        open={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
        value={dateRange}
        onChange={setDateRange}
      />
    </div>
  )
}
