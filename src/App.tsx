import { useEffect, useMemo, useRef, useState } from 'react'
import { RewardDetailModal } from './components/reward/RewardDetailModal'
import type { RewardModalVariant } from './components/reward/rewardModalTypes'
import { buildLoyaltyModalPackOverride } from './rewardLifecycle/buildLoyaltyModalPack'
import { LifecycleSimulatorPanel } from './rewardLifecycle/LifecycleSimulatorPanel'
import { LIFECYCLE_STEPS } from './rewardLifecycle/lifecycleSteps'
import { DeviceFrameProvider } from './context/DeviceFrameContext'
import { ActivityFeedScreen } from './screens/ActivityFeedScreen'
import type { ActivityDatePreset, ActivityTypeFilter } from './screens/activityFeedTypes'
import { ExnessRewardsScreen } from './screens/ExnessRewardsScreen'

type Route = 'rewards' | 'activity'

function App() {
  const [lifecycleStepIndex, setLifecycleStepIndex] = useState(0)
  const lifecycle = LIFECYCLE_STEPS[lifecycleStepIndex]

  const [route, setRoute] = useState<Route>('rewards')
  const [rewardModal, setRewardModal] = useState<{
    variant: RewardModalVariant
    feedItemId?: string
  } | null>(null)
  const [activityTypeFilter, setActivityTypeFilter] = useState<ActivityTypeFilter>('all')
  const [activityDatePreset, setActivityDatePreset] = useState<ActivityDatePreset>('all')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [route])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [lifecycleStepIndex])

  const openActivity = (opts?: { category?: ActivityTypeFilter; datePreset?: ActivityDatePreset }) => {
    setActivityTypeFilter(opts?.category ?? 'all')
    setActivityDatePreset(opts?.datePreset ?? 'all')
    setRoute('activity')
  }

  const loyaltyPackOverride = useMemo(() => {
    if (!rewardModal) return null
    return buildLoyaltyModalPackOverride(lifecycle, rewardModal.variant, rewardModal.feedItemId)
  }, [lifecycle, rewardModal])

  return (
    <main className="app-shell app-shell--device">
      <div className="demo-workbench">
        <DeviceFrameProvider>
          <div className="device-frame-scroll" ref={scrollRef}>
            {route === 'rewards' ? (
              <ExnessRewardsScreen
                onOpenActivityFeed={(opts) => openActivity(opts)}
                onOpenRewardModal={(v, id) => setRewardModal({ variant: v, feedItemId: id })}
                availableRewardsExd={lifecycle.availableRewardsExd}
                tradingWalletLabel={lifecycle.tradingWalletLabel}
                tradingWalletValue={lifecycle.tradingWalletValue}
                tradingWalletMuted={lifecycle.tradingWalletMuted}
                lifetimeCashbackUsd={lifecycle.lifetimeCashbackUsd}
                tierEarnedExdTowardGoal={lifecycle.tierEarnedExdTowardGoal}
                upcomingItems={lifecycle.upcoming}
                activityPreviewItems={lifecycle.activityPreview}
              />
            ) : (
              <ActivityFeedScreen
                onBack={() => setRoute('rewards')}
                onOpenRewardModal={(v, id) => setRewardModal({ variant: v, feedItemId: id })}
                typeFilter={activityTypeFilter}
                onTypeFilterChange={setActivityTypeFilter}
                datePreset={activityDatePreset}
                onDatePresetChange={setActivityDatePreset}
                feedGroups={lifecycle.feedGroups}
              />
            )}
          </div>
          <div className="device-home-indicator" aria-hidden />
          {rewardModal ? (
            <RewardDetailModal
              variant={rewardModal.variant}
              packOverride={loyaltyPackOverride}
              onClose={() => setRewardModal(null)}
            />
          ) : null}
        </DeviceFrameProvider>
        <LifecycleSimulatorPanel
          steps={LIFECYCLE_STEPS}
          stepIndex={lifecycleStepIndex}
          onStepIndexChange={setLifecycleStepIndex}
        />
      </div>
    </main>
  )
}

export default App
