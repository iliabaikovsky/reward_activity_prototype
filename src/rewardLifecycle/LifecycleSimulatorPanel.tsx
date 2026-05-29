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
    <aside className={styles.panel} aria-label="Lifecycle simulator">
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
        <summary className={styles.glassDetailsSummary}>Справка</summary>
        <div className={styles.glassDetailsBody}>
          <h2 className={styles.title}>Симулятор жизненного цикла</h2>
          <p className={styles.sub}>
            Шаг {stepIndex + 1} из {steps.length}. Соответствие сценарию —{' '}
            <strong>REWARD_LIFECYCLE.md</strong>. Стрелки переключают состояние экрана Rewards и
            ленты Activity.
          </p>
          <p className={styles.stepMeta}>{step.docRef}</p>
        </div>
      </details>
    </aside>
  )
}
