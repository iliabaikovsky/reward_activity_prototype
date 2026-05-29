import { useMemo, useState } from 'react'
import {
  IconCalendar,
  IconChevronDown,
  IconCheck,
} from '@tabler/icons-react'
import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import { BottomSheet } from '../components/ui/BottomSheet'
import { MobileBottomSafe, MobileStatusBar, MobileTopNav } from '../components/ui/MobileScreenShell'
import { TransactionRow } from '../components/ui/TransactionRow'
import { HIDE_DAY_SUMMARY } from '../domain/reward/featureFlags'
import { fromActivityFeedItem } from '../domain/reward/transactionAdapters'
import type { ActivityFeedGroup } from '../rewardLifecycle/activityFeedModel'
import {
  DATE_PRESET_LABELS,
  TYPE_FILTER_LABELS,
  type ActivityDatePreset,
  type ActivityTypeFilter,
} from './activityFeedTypes'
import { filterFeedGroups } from './activityFeedFilter'
import styles from './ActivityFeedScreen.module.css'

const TYPE_OPTIONS: ActivityTypeFilter[] = ['all', 'rewards', 'cashback', 'transfers', 'others']
const DATE_OPTIONS: ActivityDatePreset[] = ['all', 'last7', 'last30', 'thisMonth']

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
      <MobileStatusBar theme="light" />

      <MobileTopNav theme="light" navVariant="backOnly" onBack={onBack} />

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
                <TransactionRow
                  key={item.id}
                  {...fromActivityFeedItem(item)}
                  onClick={
                    onOpenRewardModal
                      ? () => onOpenRewardModal(item.rewardModal, item.id)
                      : undefined
                  }
                />
              ))}
            </section>
          ))
        )}
      </div>

      <MobileBottomSafe />

      <BottomSheet
        title="Type"
        open={typeSheetOpen}
        onClose={() => setTypeSheetOpen(false)}
      >
        <div className={styles.sheetList} role="listbox">
          {TYPE_OPTIONS.map((opt) => {
            const isSel = opt === typeFilter
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={isSel}
                className={`${styles.sheetOption} ${isSel ? styles.sheetOptionSelected : ''}`}
                onClick={() => {
                  onTypeFilterChange(opt)
                  setTypeSheetOpen(false)
                }}
              >
                <span className={styles.sheetOptionLabel}>{TYPE_FILTER_LABELS[opt]}</span>
                {isSel ? (
                  <IconCheck className={styles.sheetCheck} size={22} stroke={2} aria-hidden />
                ) : (
                  <span className={styles.sheetCheckSpacer} aria-hidden />
                )}
              </button>
            )
          })}
        </div>
      </BottomSheet>

      <BottomSheet
        title="Date"
        open={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
      >
        <div className={styles.sheetList} role="listbox">
          {DATE_OPTIONS.map((opt) => {
            const isSel = opt === datePreset
            return (
              <button
                key={opt}
                type="button"
                role="option"
                aria-selected={isSel}
                className={`${styles.sheetOption} ${isSel ? styles.sheetOptionSelected : ''}`}
                onClick={() => {
                  onDatePresetChange(opt)
                  setDateSheetOpen(false)
                }}
              >
                <span className={styles.sheetOptionLabel}>{DATE_PRESET_LABELS[opt]}</span>
                {isSel ? (
                  <IconCheck className={styles.sheetCheck} size={22} stroke={2} aria-hidden />
                ) : (
                  <span className={styles.sheetCheckSpacer} aria-hidden />
                )}
              </button>
            )
          })}
        </div>
      </BottomSheet>
    </div>
  )
}
