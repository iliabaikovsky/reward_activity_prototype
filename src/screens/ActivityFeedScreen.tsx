import { createPortal } from 'react-dom'
import { useEffect, useId, useMemo, useState } from 'react'
import {
  IconArrowsRightLeft,
  IconCalendar,
  IconCheck,
  IconChevronDown,
  IconChevronLeft,
  IconCrown,
  IconCrownOff,
  IconCurrencyDollar,
  IconGift,
  IconX,
} from '@tabler/icons-react'
import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import { useDeviceFrameEl } from '../context/DeviceFrameContext'
import type { ActivityFeedItem } from '../rewardLifecycle/activityFeedModel'
import {
  DATE_PRESET_LABELS,
  TYPE_FILTER_LABELS,
  type ActivityDatePreset,
  type ActivityTypeFilter,
} from './activityFeedTypes'
import { filterFeedGroups } from './activityFeedFilter'
import styles from './ActivityFeedScreen.module.css'

/** Временно скрыть сумму за день в шапке группы. Поставь false — снова покажется. */
const HIDE_DAY_SUMMARY = true

const TYPE_OPTIONS: ActivityTypeFilter[] = ['all', 'rewards', 'cashback', 'transfers', 'others']
const DATE_OPTIONS: ActivityDatePreset[] = ['all', 'last7', 'last30', 'thisMonth']

function RowIcon({ type }: { type: ActivityFeedItem['icon'] }) {
  const common = { size: 24 as const, stroke: 1.75 as const, 'aria-hidden': true as const }
  switch (type) {
    case 'dollar':
      return <IconCurrencyDollar {...common} />
    case 'crown':
      return <IconCrown {...common} />
    case 'gift':
      return <IconGift {...common} />
    case 'transfer':
      return <IconArrowsRightLeft {...common} />
    case 'crownOff':
      return <IconCrownOff {...common} />
    default:
      return null
  }
}

function FeedRow({
  item,
  onOpenRewardModal,
}: {
  item: ActivityFeedItem
  onOpenRewardModal?: (variant: RewardModalVariant, feedItemId: string) => void
}) {
  const amountClass =
    item.amountTone === 'positive'
      ? styles.amountPositive
      : item.amountTone === 'negative'
        ? styles.amountNegative
        : styles.amountNeutral

  const inner = (
    <>
      <div className={styles.iconWrap}>
        <RowIcon type={item.icon} />
      </div>
      <div className={styles.body}>
        <div className={styles.head}>
          <p className={styles.rowTitle}>{item.title}</p>
          <p className={`${styles.amount} ${amountClass}`}>{item.amount}</p>
        </div>
        <div className={styles.descRow}>
          <div className={styles.desc}>
            {item.lines.map((line) => (
              <p key={line}>{line}</p>
            ))}
          </div>
          <p className={styles.time}>{item.time}</p>
        </div>
      </div>
    </>
  )

  if (onOpenRewardModal) {
    return (
      <button
        type="button"
        className={styles.rowClickable}
        onClick={() => onOpenRewardModal(item.rewardModal, item.id)}
      >
        {inner}
      </button>
    )
  }

  return <div className={styles.row}>{inner}</div>
}

type FilterSheetProps<T extends string> = {
  title: string
  open: boolean
  onClose: () => void
  options: readonly T[]
  selected: T
  onSelect: (v: T) => void
  labelFor: (v: T) => string
}

function FilterSheet<T extends string>({
  title,
  open,
  onClose,
  options,
  selected,
  onSelect,
  labelFor,
}: FilterSheetProps<T>) {
  const titleId = useId()
  const deviceFrameEl = useDeviceFrameEl()

  useEffect(() => {
    if (!open) return
    const prevBody = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const scrollEl = deviceFrameEl?.querySelector<HTMLElement>('.device-frame-scroll') ?? null
    const prevScroll = scrollEl?.style.overflow ?? ''
    if (scrollEl) scrollEl.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBody
      if (scrollEl) scrollEl.style.overflow = prevScroll
    }
  }, [open, deviceFrameEl])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose])

  if (!open) return null

  const overlay = (
    <div className={styles.sheetOverlay} role="presentation">
      <button type="button" className={styles.sheetBackdrop} onClick={onClose} aria-label="Close" />
      <div
        className={styles.sheetPanel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.sheetGrab} aria-hidden />
        <header className={styles.sheetHeader}>
          <h2 className={styles.sheetTitle} id={titleId}>
            {title}
          </h2>
          <button type="button" className={styles.sheetCloseBtn} onClick={onClose} aria-label="Close">
            <IconX size={22} stroke={2} aria-hidden />
          </button>
        </header>
        <div className={styles.sheetList} role="listbox">
          {options.map((opt) => {
            const isSel = opt === selected
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={isSel}
                className={`${styles.sheetOption} ${isSel ? styles.sheetOptionSelected : ''}`}
                onClick={() => {
                  onSelect(opt)
                  onClose()
                }}
              >
                <span className={styles.sheetOptionLabel}>{labelFor(opt)}</span>
                {isSel ? (
                  <IconCheck className={styles.sheetCheck} size={22} stroke={2} aria-hidden />
                ) : (
                  <span className={styles.sheetCheckSpacer} aria-hidden />
                )}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )

  return deviceFrameEl ? createPortal(overlay, deviceFrameEl) : overlay
}

type Props = {
  onBack: () => void
  onOpenRewardModal?: (variant: RewardModalVariant, feedItemId?: string) => void
  typeFilter: ActivityTypeFilter
  onTypeFilterChange: (v: ActivityTypeFilter) => void
  datePreset: ActivityDatePreset
  onDatePresetChange: (v: ActivityDatePreset) => void
  feedGroups: ActivityFeedGroup[]
}

export function ActivityFeedScreen({
  onBack,
  onOpenRewardModal,
  typeFilter,
  onTypeFilterChange,
  datePreset,
  onDatePresetChange,
  feedGroups,
}: Props) {
  const [typeSheetOpen, setTypeSheetOpen] = useState(false)
  const [dateSheetOpen, setDateSheetOpen] = useState(false)

  const filteredGroups = useMemo(
    () => filterFeedGroups(feedGroups, typeFilter, datePreset),
    [feedGroups, typeFilter, datePreset],
  )

  return (
    <div className={styles.screen} data-node-id="42124:14876">
      <div className={styles.statusBar}>
        <span className={styles.statusTime}>9:41</span>
        <span className={styles.statusRight} aria-hidden />
      </div>

      <header className={styles.topNav}>
        <button type="button" className={styles.backBtn} onClick={onBack} aria-label="Back">
          <IconChevronLeft size={24} stroke={2} aria-hidden />
        </button>
      </header>

      <div className={styles.titleBlock}>
        <h1 className={styles.pageTitle}>Activity feed</h1>
      </div>

      <div className={styles.filters}>
        <button
          type="button"
          className={`${styles.filterChip} ${typeFilter !== 'all' ? styles.filterChipActive : ''}`}
          onClick={() => setTypeSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={typeSheetOpen}
        >
          <span>{TYPE_FILTER_LABELS[typeFilter]}</span>
          <span className={`${styles.filterChipIcon} ${styles.filterChevron}`}>
            <IconChevronDown size={16} stroke={2} aria-hidden />
          </span>
        </button>
        <button
          type="button"
          className={`${styles.filterChip} ${datePreset !== 'all' ? styles.filterChipActive : ''}`}
          onClick={() => setDateSheetOpen(true)}
          aria-haspopup="dialog"
          aria-expanded={dateSheetOpen}
        >
          <span className={styles.filterChipIcon}>
            <IconCalendar size={16} stroke={2} aria-hidden />
          </span>
          <span>{DATE_PRESET_LABELS[datePreset]}</span>
          <span className={`${styles.filterChipIcon} ${styles.filterChevron}`}>
            <IconChevronDown size={16} stroke={2} aria-hidden />
          </span>
        </button>
      </div>

      <div className={styles.list}>
        {feedGroups.length === 0 ? (
          <p className={styles.emptyState} role="status">
            No transactions yet.
          </p>
        ) : filteredGroups.length === 0 ? (
          <p className={styles.emptyState} role="status">
            No activity matches these filters.
          </p>
        ) : (
          filteredGroups.map((group) => (
            <section key={group.dateLabel} aria-labelledby={`feed-date-${group.dateLabel}`}>
              <div className={styles.dateHeader}>
                <h2 className={styles.dateLabel} id={`feed-date-${group.dateLabel}`}>
                  {group.dateLabel}
                </h2>
                <p
                  className={`${styles.dateSummary} ${HIDE_DAY_SUMMARY ? styles.dateSummaryHidden : ''}`}
                >
                  {group.summary}
                </p>
              </div>
              {group.items.map((item) => (
                <FeedRow
                  key={item.id}
                  item={item}
                  onOpenRewardModal={onOpenRewardModal}
                />
              ))}
            </section>
          ))
        )}
      </div>

      <div className={styles.bottomSafe} aria-hidden />

      <FilterSheet
        title="Type"
        open={typeSheetOpen}
        onClose={() => setTypeSheetOpen(false)}
        options={TYPE_OPTIONS}
        selected={typeFilter}
        onSelect={onTypeFilterChange}
        labelFor={(v) => TYPE_FILTER_LABELS[v]}
      />
      <FilterSheet
        title="Date"
        open={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
        options={DATE_OPTIONS}
        selected={datePreset}
        onSelect={onDatePresetChange}
        labelFor={(v) => DATE_PRESET_LABELS[v]}
      />
    </div>
  )
}
