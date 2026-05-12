import { useEffect, useMemo, useRef, useState } from 'react'
import { RewardDetailModal } from './components/reward/RewardDetailModal'
import type { RewardModalVariant } from './components/reward/rewardModalTypes'
import { buildLoyaltyModalPackOverride } from './rewardLifecycle/buildLoyaltyModalPack'
import { LifecycleSimulatorPanel } from './rewardLifecycle/LifecycleSimulatorPanel'
import {
  REBATE_SIMULATOR_DEFAULT_INDEX,
  REBATE_SIMULATOR_STEPS,
} from './rewardLifecycle/rebateSimulatorSteps'
import { DeviceFrameProvider } from './context/DeviceFrameContext'
import { ActivityFeedScreen } from './screens/ActivityFeedScreen'
import type { ActivityDatePreset, ActivityTypeFilter } from './screens/activityFeedTypes'
import { ExnessRewardsScreen } from './screens/ExnessRewardsScreen'
import { SpreadRebateLedgerScreen } from './screens/SpreadRebateLedgerScreen'

type Route = 'rewards' | 'activity' | 'rebateLedger'
type SpreadPrototypeVariant = 'v1' | 'v2' | 'v3' | 'v4'

function readFlexiblePrototypeFromUrl(): boolean {
  if (typeof window === 'undefined') return false
  return new URLSearchParams(window.location.search).get('v2flexible') === '1'
}

function App() {
  const [rebateStepIndex, setRebateStepIndex] = useState(REBATE_SIMULATOR_DEFAULT_INDEX)
  const rebateScenario = REBATE_SIMULATOR_STEPS[rebateStepIndex]
  const lifecycle = rebateScenario.lifecycle

  const flexiblePrototypeEnabled = useMemo(() => readFlexiblePrototypeFromUrl(), [])

  const [route, setRoute] = useState<Route>('rewards')
  const [rewardModal, setRewardModal] = useState<{
    variant: RewardModalVariant
    feedItemId?: string
  } | null>(null)
  const [activityTypeFilter, setActivityTypeFilter] = useState<ActivityTypeFilter>('all')
  const [activityDatePreset, setActivityDatePreset] = useState<ActivityDatePreset>('all')
  const [spreadVariant, setSpreadVariant] = useState<SpreadPrototypeVariant>('v4')
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!flexiblePrototypeEnabled && spreadVariant === 'v2') {
      setSpreadVariant('v4')
    }
  }, [flexiblePrototypeEnabled, spreadVariant])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [route])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [rebateStepIndex])

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
            {route === 'rebateLedger' ? (
              <SpreadRebateLedgerScreen
                onBack={() => setRoute('rewards')}
                rebateDemo={rebateScenario.rebate}
                rebateScenarioId={rebateScenario.id}
              />
            ) : route === 'rewards' ? (
              <ExnessRewardsScreen
                spreadVariant={spreadVariant}
                onSpreadVariantChange={flexiblePrototypeEnabled ? setSpreadVariant : undefined}
                rebateScenarioId={rebateScenario.id}
                rebateDemo={rebateScenario.rebate}
                onOpenActivityFeed={(opts) => openActivity(opts)}
                onOpenRebateLedger={() => setRoute('rebateLedger')}
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
        <div className="demo-workbench-simulator">
          <LifecycleSimulatorPanel
            steps={REBATE_SIMULATOR_STEPS}
            stepIndex={rebateStepIndex}
            onStepIndexChange={setRebateStepIndex}
            spreadVariant={spreadVariant}
            onSpreadVariantChange={flexiblePrototypeEnabled ? setSpreadVariant : undefined}
            flexiblePrototypeEnabled={flexiblePrototypeEnabled}
          />
        </div>
      </div>
    </main>
  )
}

export default App
