import { IconCalendar, IconChevronDown } from '@tabler/icons-react'
import {
  formatDateRangeChipLabel,
  isDateRangeActive,
  type DateRangeFilter,
} from '../../domain/reward/dateRangeFilter'
import styles from './DateRangeFilterChip.module.css'

type Props = {
  value: DateRangeFilter
  onClick: () => void
  expanded?: boolean
}

export function DateRangeFilterChip({ value, onClick, expanded = false }: Props) {
  const active = isDateRangeActive(value)
  const label = formatDateRangeChipLabel(value)

  return (
    <button
      type="button"
      className={`${styles.chip} ${active ? styles.chipActive : ''}`}
      onClick={onClick}
      aria-haspopup="dialog"
      aria-expanded={expanded}
    >
      <span className={styles.chipIcon}>
        <IconCalendar size={16} stroke={2} aria-hidden />
      </span>
      <span>{label}</span>
      <span className={`${styles.chipIcon} ${styles.chipChevron}`}>
        <IconChevronDown size={16} stroke={2} aria-hidden />
      </span>
    </button>
  )
}
