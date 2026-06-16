import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { RewardDetailModal } from './components/reward/RewardDetailModal'
import type { RewardModalVariant } from './components/reward/rewardModalTypes'
import { buildRewardModalPackOverride } from './rewardLifecycle/buildLoyaltyModalPack'
import { buildTradingOrderRegistryForStep, buildCompanionAggregatesForStep, applyLinkedTradeDemoFallback } from './rewardLifecycle/buildTradingOrderRegistry'
import { LifecycleSimulatorPanel } from './rewardLifecycle/LifecycleSimulatorPanel'
import { parsePrototypeSearchParams } from './rewardLifecycle/parsePrototypeSearchParams'
import { LIFECYCLE_STEPS } from './rewardLifecycle/lifecycleSteps'
import { DeviceFrameProvider } from './context/DeviceFrameContext'
import { releaseDeviceFrameScrollLock } from './components/ui/useBottomSheet'
import { ActivityFeedScreen } from './screens/ActivityFeedScreen'
import {
  ALL_TIME_DATE_RANGE,
  type ActivityTypeFilter,
  type DateRangeFilter,
} from './screens/activityFeedTypes'
import { ExnessRewardsScreen } from './screens/ExnessRewardsScreen'
import { OrderChartScreen } from './screens/OrderChartScreen'
import { EarnRewardsModal } from './components/reward/EarnRewardsModal'
import { ExnessRewardsPromoModal } from './components/reward/ExnessRewardsPromoModal'

type Route = 'rewards' | 'activity' | 'chart'

type RewardModalState = {
  variant: RewardModalVariant
  itemId?: string
  /** After cross-type closed-order drill, Close → Exness Rewards home. */
  returnHomeOnClose?: boolean
}

function App() {
  const prototypeParams = useMemo(() => parsePrototypeSearchParams(), [])
  const [lifecycleStepIndex, setLifecycleStepIndex] = useState(prototypeParams.initialStepIndex)
  const lifecycle = LIFECYCLE_STEPS[lifecycleStepIndex]

  const [route, setRoute] = useState<Route>('rewards')
  const [rewardModal, setRewardModal] = useState<RewardModalState | null>(null)
  const [chartOrderNum, setChartOrderNum] = useState<string | null>(null)
  const [activityTypeFilter, setActivityTypeFilter] = useState<ActivityTypeFilter>('all')
  const [activityDateRange, setActivityDateRange] = useState<DateRangeFilter>(ALL_TIME_DATE_RANGE)
  const [rewardsHomeResetKey, setRewardsHomeResetKey] = useState(0)
  const [promoOpen, setPromoOpen] = useState(false)
  const [earnRewardsOpen, setEarnRewardsOpen] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [route])

  useEffect(() => {
    scrollRef.current?.scrollTo(0, 0)
  }, [lifecycleStepIndex])

  const openActivity = (opts?: {
    category?: ActivityTypeFilter
    dateRange?: DateRangeFilter
  }) => {
    setActivityTypeFilter(opts?.category ?? 'all')
    setActivityDateRange(opts?.dateRange ?? ALL_TIME_DATE_RANGE)
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

  const sidePanel = (
    <LifecycleSimulatorPanel
      steps={LIFECYCLE_STEPS}
      stepIndex={lifecycleStepIndex}
      onStepIndexChange={setLifecycleStepIndex}
    />
  )

  return (
    <main
      className={`app-shell app-shell--device${prototypeParams.utMode ? ' app-shell--ut' : ''}`}
    >
      <div className="demo-workbench">
        <DeviceFrameProvider>
          <div className="device-frame-scroll" ref={scrollRef}>
            {route === 'rewards' ? (
              <ExnessRewardsScreen
                simulatorStepId={lifecycle.id}
                rewardsHomeResetKey={rewardsHomeResetKey}
                onOpenActivityFeed={(opts) => openActivity(opts)}
                onOpenRewardModal={openRewardModal}
                onOpenPromo={() => setPromoOpen(true)}
                onOpenEarnRewards={() => setEarnRewardsOpen(true)}
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
                dateRange={activityDateRange}
                onDateRangeChange={setActivityDateRange}
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
          {promoOpen ? (
            <ExnessRewardsPromoModal open={promoOpen} onClose={() => setPromoOpen(false)} />
          ) : null}
          {earnRewardsOpen ? (
            <EarnRewardsModal open={earnRewardsOpen} onClose={() => setEarnRewardsOpen(false)} />
          ) : null}
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
        {prototypeParams.utMode ? null : (
          <div className="demo-workbench-simulator">{sidePanel}</div>
        )}
      </div>
    </main>
  )
}

export default App
