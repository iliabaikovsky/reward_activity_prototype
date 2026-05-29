import { useLayoutEffect, useRef } from 'react'
import { IconChevronLeft, IconChevronRight } from '@tabler/icons-react'
import { formatDemoTodayLabel } from './demoTimeline'
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
  const { lead, bullets } = step.simulatorBlurb

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
        <summary className={styles.glassDetailsSummary}>Что видим</summary>
        <div className={styles.glassDetailsBody}>
          <p className={styles.blurbDate}>{formatDemoTodayLabel(step.simulatorTodayIso)}</p>
          <p className={styles.blurbLead}>{lead}</p>
          <ul className={styles.blurbList}>
            {bullets.map((line) => (
              <li key={line}>{line}</li>
            ))}
          </ul>
        </div>
      </details>
    </aside>
  )
}
