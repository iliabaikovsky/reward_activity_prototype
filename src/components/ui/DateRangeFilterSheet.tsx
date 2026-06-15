import { useEffect, useId, useState } from 'react'
import {
  ALL_TIME_DATE_RANGE,
  normalizeDateRange,
  type DateRangeFilter,
} from '../../domain/reward/dateRangeFilter'
import { CenteredDialog } from './CenteredDialog'
import { RangeCalendarPicker, type CalendarDraftRange } from './RangeCalendarPicker'
import styles from './DateRangeFilterSheet.module.css'

type Props = {
  open: boolean
  onClose: () => void
  value: DateRangeFilter
  onChange: (next: DateRangeFilter) => void
  /** Demo «today» dot on calendar (YYYY-MM-DD). */
  todayIso?: string
}

function draftFromValue(value: DateRangeFilter): CalendarDraftRange {
  if (value.mode === 'range') {
    return { startIso: value.startIso, endIso: value.endIso }
  }
  return { startIso: null, endIso: null }
}

export function DateRangeFilterSheet({
  open,
  onClose,
  value,
  onChange,
  todayIso,
}: Props) {
  const titleId = useId()
  const [draft, setDraft] = useState<CalendarDraftRange>(draftFromValue(value))

  useEffect(() => {
    if (!open) return
    setDraft(draftFromValue(value))
  }, [open, value])

  const handleClear = () => {
    onChange(ALL_TIME_DATE_RANGE)
    onClose()
  }

  const handleOk = () => {
    if (!draft.startIso) return
    const endIso = draft.endIso ?? draft.startIso
    onChange(normalizeDateRange(draft.startIso, endIso))
    onClose()
  }

  return (
    <CenteredDialog open={open} onClose={onClose} titleId={titleId}>
      <span id={titleId} className={styles.srOnly}>
        Select date range
      </span>
      <RangeCalendarPicker
        key={open ? (value.mode === 'range' ? value.startIso : 'all') : 'closed'}
        draft={draft}
        onDraftChange={setDraft}
        todayIso={todayIso}
        onClear={handleClear}
        onCancel={onClose}
        onOk={handleOk}
        className={styles.calendarCard}
      />
    </CenteredDialog>
  )
}
