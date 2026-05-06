import { useLayoutEffect, useRef } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import type { RebateSimulatorStep } from './rebateSimulatorSteps'
import styles from './LifecycleSimulatorPanel.module.css'

type Props = {
  steps: RebateSimulatorStep[]
  stepIndex: number
  onStepIndexChange: (index: number) => void
  spreadVariant: 'v1' | 'v2' | 'v3' | 'v4'
  onSpreadVariantChange: (variant: 'v1' | 'v2' | 'v3' | 'v4') => void
}

export function LifecycleSimulatorPanel({
  steps,
  stepIndex,
  onStepIndexChange,
  spreadVariant,
  onSpreadVariantChange,
}: Props) {
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
          aria-label="Предыдущий шаг"
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
          aria-label="Следующий шаг"
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
            Пять этапов для прототипа программы (T+60, USD/EXD, on-hold). Экран Rewards и лента
            синхронизированы с выбранным шагом; варианты V1–V4 только меняют вёрстку.
          </p>

          <label className={styles.stepMeta} htmlFor="rebate-step-select">
            Шаг {stepIndex + 1} / {steps.length}
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

          <div className={styles.variantBlock}>
            <p className={styles.variantTitle}>Spread rebate prototypes</p>
            <p className={styles.variantSub}>Switches V1-V4 visualization inside Rewards screen</p>
            <div className={styles.variantButtons}>
              <button
                type="button"
                className={`${styles.variantBtn} ${spreadVariant === 'v1' ? styles.variantBtnActive : ''}`}
                onClick={() => onSpreadVariantChange('v1')}
              >
                V1 · In Upcoming
              </button>
              <button
                type="button"
                className={`${styles.variantBtn} ${spreadVariant === 'v2' ? styles.variantBtnActive : ''}`}
                onClick={() => onSpreadVariantChange('v2')}
              >
                V2 · Flexible Upcoming
              </button>
              <button
                type="button"
                className={`${styles.variantBtn} ${spreadVariant === 'v3' ? styles.variantBtnActive : ''}`}
                onClick={() => onSpreadVariantChange('v3')}
              >
                V3 · Separate Widget
              </button>
              <button
                type="button"
                className={`${styles.variantBtn} ${spreadVariant === 'v4' ? styles.variantBtnActive : ''}`}
                onClick={() => onSpreadVariantChange('v4')}
              >
                V4 · Hybrid section
              </button>
            </div>
          </div>

          <p className={styles.stepMeta}>Снимок состояния</p>
          <pre className={styles.snapshot}>{snapshot}</pre>
        </div>
      </details>
    </aside>
  )
}
