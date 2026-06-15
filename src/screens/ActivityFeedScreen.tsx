import { useMemo, useState } from 'react'
import { IconChevronDown, IconCheck } from '@tabler/icons-react'
import type { RewardModalVariant } from '../components/reward/rewardModalTypes'
import { BottomSheet } from '../components/ui/BottomSheet'
import { DateRangeFilterChip } from '../components/ui/DateRangeFilterChip'
import { DateRangeFilterSheet } from '../components/ui/DateRangeFilterSheet'
import { MobileBottomSafe, MobileStatusBar, MobileTopNav } from '../components/ui/MobileScreenShell'
import { AppH1, AppH3 } from '../components/ui/AppHeading'
import { SummaryHeroAmount } from '../components/ui/SummaryHeroAmount'
import { TransactionRow } from '../components/ui/TransactionRow'
import { HIDE_DAY_SUMMARY } from '../domain/reward/featureFlags'
import { fromActivityFeedItem } from '../domain/reward/transactionAdapters'
import type { ActivityFeedGroup } from '../rewardLifecycle/activityFeedModel'
import {
  TYPE_FILTER_LABELS,
  type ActivityTypeFilter,
  type DateRangeFilter,
} from './activityFeedTypes'
import { summarizeActivityFeedByType } from '../domain/reward/activityFeedSummary'
import { filterFeedGroups } from './activityFeedFilter'
import styles from './ActivityFeedScreen.module.css'

const TYPE_OPTIONS: ActivityTypeFilter[] = ['all', 'rewards', 'cashback', 'transfers', 'others']

type Props = {
  onBack: () => void
  onOpenRewardModal?: (variant: RewardModalVariant, feedItemId?: string) => void
  typeFilter: ActivityTypeFilter
  onTypeFilterChange: (v: ActivityTypeFilter) => void
  dateRange: DateRangeFilter
  onDateRangeChange: (v: DateRangeFilter) => void
  feedGroups: ActivityFeedGroup[]
  demoTodayIso: string
}

export function ActivityFeedScreen({
  onBack,
  onOpenRewardModal,
  typeFilter,
  onTypeFilterChange,
  dateRange,
  onDateRangeChange,
  feedGroups,
  demoTodayIso,
}: Props) {
  const [typeSheetOpen, setTypeSheetOpen] = useState(false)
  const [dateSheetOpen, setDateSheetOpen] = useState(false)

  const filteredGroups = useMemo(
    () => filterFeedGroups(feedGroups, typeFilter, dateRange),
    [feedGroups, typeFilter, dateRange],
  )

  const filterSummary = useMemo(() => {
    const items = filteredGroups.flatMap((g) => g.items)
    return summarizeActivityFeedByType(items, typeFilter, dateRange)
  }, [filteredGroups, typeFilter, dateRange])

  return (
    <div className={styles.screen} data-node-id="42124:14876">
      <MobileStatusBar theme="light" />

      <MobileTopNav theme="light" navVariant="backOnly" onBack={onBack} />

      <div className={styles.titleBlock}>
        <AppH1 className={styles.pageTitle}>Activity feed</AppH1>
      </div>

      <div className={styles.filters} data-screenshot="activity-filters">
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
        <DateRangeFilterChip
          value={dateRange}
          onClick={() => setDateSheetOpen(true)}
          expanded={dateSheetOpen}
        />
      </div>

      {filterSummary ? (
        <div
          className={styles.filterSummaryHero}
          role="status"
          aria-label={filterSummary.ariaLabel}
        >
          <div className={styles.filterSummaryTotalRow}>
            <p className={styles.filterSummaryLabel}>{filterSummary.scopeLabel}</p>
            <SummaryHeroAmount>{filterSummary.amountPrimary}</SummaryHeroAmount>
            {filterSummary.amountSecondary ? (
              <SummaryHeroAmount variant="secondary">
                {filterSummary.amountSecondary}
              </SummaryHeroAmount>
            ) : null}
          </div>
        </div>
      ) : null}

      <div className={styles.list} data-screenshot="activity-list">
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
                <AppH3 className={styles.dateLabel} id={`feed-date-${group.dateLabel}`}>
                  {group.dateLabel}
                </AppH3>
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
                  dataFeedItemId={item.id}
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

      <DateRangeFilterSheet
        open={dateSheetOpen}
        onClose={() => setDateSheetOpen(false)}
        value={dateRange}
        onChange={onDateRangeChange}
        todayIso={demoTodayIso}
      />
    </div>
  )
}
