import { useLayoutEffect, useRef } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import type { RebateSimulatorStep } from './rebateSimulatorSteps'
import styles from './LifecycleSimulatorPanel.module.css'

type Props = {
  steps: RebateSimulatorStep[]
  stepIndex: number
  onStepIndexChange: (index: number) => void
}

export function LifecycleSimulatorPanel({ steps, stepIndex, onStepIndexChange }: Props) {
  const step = steps[stepIndex]
  const last = steps.length - 1
  const detailsRef = useRef<HTMLDetailsElement>(null)
  const life = step.lifecycle
  const r = step.rebate

  const snapshot = [
    `Spread pending: ${r.pendingCount} · USD ${r.pendingUsd} · EXD ${r.pendingExd}`,
    `Next: ${r.nextPayoutDate} · On-hold USD: ${r.onHoldUsdAmount} (${r.onHoldUsdCount})`,
    `Available: ${life.availableRewardsExd} · Trading: ${life.tradingWalletValue}`,
    `Lifetime cashback: ${life.lifetimeCashbackUsd} · Feed groups: ${life.feedGroups.length}`,
  ].join('\n')

  useLayoutEffect(() => {
    const mq = window.matchMedia('(min-width: 481px)')
    const sync = () => {
      const el = detailsRef.current
      if (el) el.open = mq.matches
    }
    sync()
    mq.addEventListener('change', sync)
    return () => mq.removeEventListener('change', sync)
  }, [])

  return (
    <aside className={styles.panel} aria-label="Spread rebate simulator">
      <div className={styles.glassRail}>
        <button
          type="button"
          className={styles.glassIconBtn}
          disabled={stepIndex <= 0}
          aria-label="Предыдущее состояние"
          onClick={() => onStepIndexChange(stepIndex - 1)}
        >
          <IconChevronLeft size={20} stroke={2} aria-hidden />
        </button>
        <div className={styles.glassStepText} role="status" aria-live="polite">
          <span className={styles.glassStepNum}>{stepIndex + 1}.</span>
          <span className={styles.glassStepName}>{step.label}</span>
        </div>
        <button
          type="button"
          className={styles.glassIconBtn}
          disabled={stepIndex >= last}
          aria-label="Следующее состояние"
          onClick={() => onStepIndexChange(stepIndex + 1)}
        >
          <IconChevronRight size={20} stroke={2} aria-hidden />
        </button>
      </div>

      <details ref={detailsRef} className={styles.glassDetails}>
        <summary className={styles.glassDetailsSummary}>Справка и снимок состояния</summary>
        <div className={styles.glassDetailsBody}>
          <h2 className={styles.title}>Симулятор spread rebate</h2>
          <p className={styles.sub}>
            «Ноль» и «После месяца торговли» — экран Rewards и лента Activity совпадают с выбранным
            состоянием.
          </p>

          <label className={styles.stepMeta} htmlFor="rebate-step-select">
            Состояние {stepIndex + 1} / {steps.length}
          </label>
          <select
            id="rebate-step-select"
            className={styles.select}
            value={stepIndex}
            onChange={(e) => onStepIndexChange(Number(e.target.value))}
          >
            {steps.map((s, i) => (
              <option key={s.id} value={i}>
                {i + 1}. {s.label}
              </option>
            ))}
          </select>

          <p className={styles.stepMeta}>Снимок состояния</p>
          <pre className={styles.snapshot}>{snapshot}</pre>
        </div>
      </details>
    </aside>
  )
}
