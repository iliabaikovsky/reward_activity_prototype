import { createPortal } from 'react-dom'
import { useId, type ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'
import { useBottomSheet, useDeviceFrameEl } from './useBottomSheet'
import styles from './BottomSheet.module.css'

type Props = {
  title: string
  open: boolean
  onClose: () => void
  children: ReactNode
  /** Скрыть кнопку закрытия (для nested sheets с back). */
  showClose?: boolean
}

export function BottomSheet({ title, open, onClose, children, showClose = true }: Props) {
  const titleId = useId()
  const deviceFrameEl = useDeviceFrameEl()
  useBottomSheet(open, onClose)

  if (!open) return null

  const overlay = (
    <div className={styles.overlay} role="presentation">
      <button type="button" className={styles.backdrop} onClick={onClose} aria-label="Close" />
      <div
        className={styles.panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div className={styles.grab} aria-hidden />
        <header className={styles.header}>
          <h2 className={styles.title} id={titleId}>
            {title}
          </h2>
          {showClose ? (
            <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
              <IconX size={22} stroke={2} aria-hidden />
            </button>
          ) : (
            <span className={styles.closeSpacer} aria-hidden />
          )}
        </header>
        {children}
      </div>
    </div>
  )

  return deviceFrameEl ? createPortal(overlay, deviceFrameEl) : overlay
}
