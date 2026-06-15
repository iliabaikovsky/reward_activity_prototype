import { useMemo, useState } from 'react'
import { IconChevronDown, IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import {
  buildMonthGrid,
  compareIso,
  monthYearLabel,
  parseIsoToMonth,
  weekdayLabels,
  type CalendarDayCell,
} from '../../domain/reward/calendarGrid'
import { normalizeDateRange } from '../../domain/reward/dateRangeFilter'
import styles from './RangeCalendarPicker.module.css'

export type CalendarDraftRange = {
  startIso: string | null
  endIso: string | null
}

type DayVisual =
  | 'outside'
  | 'default'
  | 'today'
  | 'inRange'
  | 'rangeStart'
  | 'rangeEnd'
  | 'rangeSingle'

type Props = {
  draft: CalendarDraftRange
  onDraftChange: (next: CalendarDraftRange) => void
  todayIso?: string
  initialYear?: number
  initialMonth?: number
  onClear: () => void
  onCancel: () => void
  onOk: () => void
  className?: string
}

function resolveInitialMonth(
  draft: CalendarDraftRange,
  initialYear?: number,
  initialMonth?: number,
): { year: number; month: number } {
  if (initialYear != null && initialMonth != null) {
    return { year: initialYear, month: initialMonth }
  }
  if (draft.startIso) return parseIsoToMonth(draft.startIso)
  return { year: 2026, month: 2 }
}

function dayVisual(
  cell: CalendarDayCell,
  draft: CalendarDraftRange,
  todayIso: string | undefined,
): DayVisual {
  if (!cell.inCurrentMonth) return 'outside'

  const { startIso, endIso } = draft
  const isToday = todayIso === cell.iso

  if (!startIso) return isToday ? 'today' : 'default'

  const end = endIso ?? startIso
  const lo = compareIso(startIso, end) <= 0 ? startIso : end
  const hi = compareIso(startIso, end) <= 0 ? end : startIso
  const inRange = compareIso(cell.iso, lo) >= 0 && compareIso(cell.iso, hi) <= 0

  if (!inRange) return isToday ? 'today' : 'default'
  if (lo === hi) return 'rangeSingle'
  if (cell.iso === lo) return 'rangeStart'
  if (cell.iso === hi) return 'rangeEnd'
  return 'inRange'
}

export function RangeCalendarPicker({
  draft,
  onDraftChange,
  todayIso,
  initialYear,
  initialMonth,
  onClear,
  onCancel,
  onOk,
  className,
}: Props) {
  const initial = resolveInitialMonth(draft, initialYear, initialMonth)
  const [viewYear, setViewYear] = useState(initial.year)
  const [viewMonth, setViewMonth] = useState(initial.month)

  const weeks = useMemo(() => buildMonthGrid(viewYear, viewMonth), [viewYear, viewMonth])

  const shiftMonth = (delta: number) => {
    const d = new Date(viewYear, viewMonth + delta, 1)
    setViewYear(d.getFullYear())
    setViewMonth(d.getMonth())
  }

  const handleDayClick = (cell: CalendarDayCell) => {
    if (!cell.inCurrentMonth) return

    const { startIso, endIso } = draft
    if (!startIso || (startIso && endIso)) {
      onDraftChange({ startIso: cell.iso, endIso: null })
      return
    }

    const normalized = normalizeDateRange(startIso, cell.iso)
    if (normalized.mode === 'range') {
      onDraftChange({ startIso: normalized.startIso, endIso: normalized.endIso })
    }
  }

  const canOk = Boolean(draft.startIso)

  return (
    <div
      className={`${styles.card} ${className ?? ''}`.trim()}
      data-node-id="42228:18233"
    >
      <div className={styles.header}>
        <p className={styles.monthLabel}>
          {monthYearLabel(viewYear, viewMonth)}
          <span className={styles.monthChevron} aria-hidden>
            <IconChevronDown size={15} stroke={2} />
          </span>
        </p>
        <div className={styles.nav}>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => shiftMonth(-1)}
            aria-label="Previous month"
          >
            <IconChevronLeft size={24} stroke={2} aria-hidden />
          </button>
          <button
            type="button"
            className={styles.navBtn}
            onClick={() => shiftMonth(1)}
            aria-label="Next month"
          >
            <IconChevronRight size={24} stroke={2} aria-hidden />
          </button>
        </div>
      </div>

      <div className={styles.weekdays}>
        {weekdayLabels().map((label) => (
          <p key={label} className={styles.weekday}>
            {label}
          </p>
        ))}
      </div>

      {weeks.map((week, wi) => (
        <div key={wi} className={styles.week}>
          {week.map((cell) => {
            const visual = dayVisual(cell, draft, todayIso)
            const showBg =
              visual === 'inRange' ||
              visual === 'rangeStart' ||
              visual === 'rangeEnd' ||
              visual === 'rangeSingle'

            return (
              <div key={cell.iso} className={styles.daySlot}>
                {showBg ? (
                  <span
                    className={`${styles.rangeBg} ${
                      visual === 'rangeStart'
                        ? styles.rangeBgStart
                        : visual === 'rangeEnd'
                          ? styles.rangeBgEnd
                          : visual === 'rangeSingle'
                            ? styles.rangeBgSingle
                            : ''
                    }`}
                    aria-hidden
                  />
                ) : null}
                <button
                  type="button"
                  className={`${styles.dayBtn} ${
                    visual === 'outside'
                      ? styles.dayBtnOutside
                      : visual === 'today'
                        ? styles.dayBtnToday
                        : showBg
                          ? styles.dayBtnInRange
                          : ''
                  }`}
                  onClick={() => handleDayClick(cell)}
                  disabled={visual === 'outside'}
                  aria-pressed={showBg}
                >
                  {cell.day}
                </button>
              </div>
            )
          })}
        </div>
      ))}

      <div className={styles.footer}>
        <button type="button" className={`${styles.textBtn} ${styles.clearBtn}`} onClick={onClear}>
          Clear
        </button>
        <button type="button" className={styles.textBtn} onClick={onCancel}>
          Cancel
        </button>
        <button type="button" className={styles.okBtn} onClick={onOk} disabled={!canOk}>
          OK
        </button>
      </div>
    </div>
  )
}
