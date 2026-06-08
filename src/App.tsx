import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RewardDetailModal } from './components/reward/RewardDetailModal'
import type { RewardModalVariant } from './components/reward/rewardModalTypes'
import { buildRewardModalPackOverride } from './rewardLifecycle/buildLoyaltyModalPack'
import { buildTradingOrderRegistryForStep, buildCompanionAggregatesForStep, applyLinkedTradeDemoFallback } from './rewardLifecycle/buildTradingOrderRegistry'
import { LifecycleSimulatorPanel } from './rewardLifecycle/LifecycleSimulatorPanel'
import { LIFECYCLE_STEPS } from './rewardLifecycle/lifecycleSteps'
import { DeviceFrameProvider } from './context/DeviceFrameContext'
import { releaseDeviceFrameScrollLock } from './components/ui/useBottomSheet'
import { ActivityFeedScreen } from './screens/ActivityFeedScreen'
import type { ActivityDatePreset, ActivityTypeFilter } from './screens/activityFeedTypes'
import { ExnessRewardsScreen } from './screens/ExnessRewardsScreen'
import { OrderChartScreen } from './screens/OrderChartScreen'

type Route = 'rewards' | 'activity' | 'chart'

type RewardModalState = {
  variant: RewardModalVariant
  itemId?: string
  /** After cross-type closed-order drill, Close → Exness Rewards home. */
  returnHomeOnClose?: boolean
}

function App() {
  const [lifecycleStepIndex, setLifecycleStepIndex] = useState(0)
  const lifecycle = LIFECYCLE_STEPS[lifecycleStepIndex]

  const [route, setRoute] = useState<Route>('rewards')
  const [rewardModal, setRewardModal] = useState<RewardModalState | null>(null)
  const [chartOrderNum, setChartOrderNum] = useState<string | null>(null)
  const [activityTypeFilter, setActivityTypeFilter] = useState<ActivityTypeFilter>('all')
  const [activityDatePreset, setActivityDatePreset] = useState<ActivityDatePreset>('all')
  const [rewardsHomeResetKey, setRewardsHomeResetKey] = useState(0)
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

  const rewardPackOverride = useMemo(() => {
    if (!rewardModal) return null
    return buildRewardModalPackOverride(lifecycle, rewardModal.variant, rewardModal.itemId)
  }, [lifecycle, rewardModal])

  const tradingOrderRegistry = useMemo(
    () => buildTradingOrderRegistryForStep(lifecycle),
    [lifecycle],
  )

  const companionAggregates = useMemo(
    () => buildCompanionAggregatesForStep(lifecycle),
    [lifecycle],
  )

  const chartOrderRewards = useMemo(() => {
    if (!chartOrderNum) return undefined
    const registry = { ...tradingOrderRegistry }
    applyLinkedTradeDemoFallback(registry)
    return registry[chartOrderNum]
  }, [chartOrderNum, tradingOrderRegistry])

  const openRewardModal = useCallback((variant: RewardModalVariant, itemId?: string) => {
    setRewardModal({ variant, itemId, returnHomeOnClose: false })
  }, [])

  const markCrossTypeDrill = useCallback(() => {
    setRewardModal((prev) => (prev ? { ...prev, returnHomeOnClose: true } : prev))
  }, [])

  const scrollRewardsHome = useCallback(() => {
    scrollRef.current?.scrollTo(0, 0)
    document.querySelector<HTMLElement>('.device-frame-scroll')?.scrollTo(0, 0)
    releaseDeviceFrameScrollLock()
  }, [])

  const closeRewardModal = useCallback(() => {
    setRewardModal((prev) => {
      if (prev?.returnHomeOnClose) {
        setRoute('rewards')
        setRewardsHomeResetKey((k) => k + 1)
        requestAnimationFrame(scrollRewardsHome)
      }
      return null
    })
  }, [scrollRewardsHome])

  const openChartFromModal = useCallback((orderNum: string) => {
    setChartOrderNum(orderNum)
    setRewardModal(null)
    setRoute('chart')
    queueMicrotask(releaseDeviceFrameScrollLock)
  }, [])

  const handleBackToRewardsFromChart = useCallback(() => {
    setRoute('rewards')
    setChartOrderNum(null)
    setRewardModal(null)
    queueMicrotask(releaseDeviceFrameScrollLock)
  }, [])

  return (
    <main className="app-shell app-shell--device">
      <div className="demo-workbench">
        <DeviceFrameProvider>
          <div className="device-frame-scroll" ref={scrollRef}>
            {route === 'rewards' ? (
              <ExnessRewardsScreen
                simulatorStepId={lifecycle.id}
                rewardsHomeResetKey={rewardsHomeResetKey}
                onOpenActivityFeed={(opts) => openActivity(opts)}
                onOpenRewardModal={openRewardModal}
                availableRewardsExd={lifecycle.availableRewardsExd}
                tradingWalletLabel={lifecycle.tradingWalletLabel}
                tradingWalletValue={lifecycle.tradingWalletValue}
                tradingWalletMuted={lifecycle.tradingWalletMuted}
                lifetimeCashbackUsd={lifecycle.lifetimeCashbackUsd}
                tierEarnedExdTowardGoal={lifecycle.tierEarnedExdTowardGoal}
                upcomingItems={lifecycle.upcoming}
                activityPreviewItems={lifecycle.activityPreview}
                demoTodayIso={lifecycle.simulatorTodayIso}
              />
            ) : route === 'activity' ? (
              <ActivityFeedScreen
                onBack={() => setRoute('rewards')}
                onOpenRewardModal={openRewardModal}
                typeFilter={activityTypeFilter}
                onTypeFilterChange={setActivityTypeFilter}
                datePreset={activityDatePreset}
                onDatePresetChange={setActivityDatePreset}
                feedGroups={lifecycle.feedGroups}
                demoTodayIso={lifecycle.simulatorTodayIso}
              />
            ) : chartOrderNum ? (
              <OrderChartScreen
                orderNum={chartOrderNum}
                rewards={chartOrderRewards}
                onBackToRewards={handleBackToRewardsFromChart}
              />
            ) : null}
          </div>
          <div className="device-home-indicator" aria-hidden />
          {rewardModal && route !== 'chart' ? (
            <RewardDetailModal
              variant={rewardModal.variant}
              modalItemId={rewardModal.itemId}
              packOverride={rewardPackOverride}
              tradingOrderRegistry={tradingOrderRegistry}
              companionAggregates={companionAggregates}
              onClose={closeRewardModal}
              onCrossTypeDrill={markCrossTypeDrill}
              onOpenChart={openChartFromModal}
            />
          ) : null}
        </DeviceFrameProvider>
        <div className="demo-workbench-simulator">
          <LifecycleSimulatorPanel
            steps={LIFECYCLE_STEPS}
            stepIndex={lifecycleStepIndex}
            onStepIndexChange={setLifecycleStepIndex}
          />
        </div>
      </div>
    </main>
  )
}

export default App
