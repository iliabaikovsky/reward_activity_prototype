import { useLayoutEffect, useRef } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import type { LifecycleStep } from './lifecycleSteps'
import styles from './LifecycleSimulatorPanel.module.css'

type Props = {
  steps: LifecycleStep[]
  stepIndex: number
  onStepIndexChange: (index: number) => void
}

export function LifecycleSimulatorPanel({ steps, stepIndex, onStepIndexChange }: Props) {
  const step = steps[stepIndex]
  const last = steps.length - 1
  const detailsRef = useRef<HTMLDetailsElement>(null)

  const snapshot = [
    `Available: ${step.availableRewardsExd}`,
    `Trading wallet: ${step.tradingWalletValue} (${step.tradingWalletLabel})`,
    `Lifetime cashback: ${step.lifetimeCashbackUsd}`,
    `Upcoming: ${step.upcoming.length} row(s)`,
    `Activity (home): ${step.activityPreview.length} row(s)`,
    `Feed groups: ${step.feedGroups.length}`,
  ].join('\n')

  useLayoutEffect(() => {
    /* ≥481px: раскрыта справка; ≤480px блок скрыт в CSS */
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
    <aside className={styles.panel} aria-label="Lifecycle simulator">
      {/* Figma 42137:26421 — liquid glass rail */}
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
          <h2 className={styles.title}>Симулятор жизненного цикла</h2>
          <p className={styles.sub}>
            Соответствие шагов — файл <strong>REWARD_LIFECYCLE.md</strong> в корне репо. Суммы в списках
            и ленте совпадают со сценарием; bottom sheet при клике — демо-пресеты прототипа.
          </p>

          <label className={styles.stepMeta} htmlFor="lifecycle-step-select">
            Шаг {stepIndex + 1} / {steps.length}
          </label>
          <select
            id="lifecycle-step-select"
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

          <p className={styles.stepLabel}>{step.label}</p>
          <p className={styles.stepMeta}>{step.docRef}</p>

          <p className={styles.stepMeta}>Снимок состояния</p>
          <pre className={styles.snapshot}>{snapshot}</pre>
        </div>
      </details>
    </aside>
  )
}
