import { createPortal } from 'react-dom'
import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { useBottomSheet, useDeviceFrameEl } from './useBottomSheet'
import styles from './CenteredDialog.module.css'

type Props = {
  open: boolean
  onClose: () => void
  titleId?: string
  children: ReactNode
  className?: string
}

export function CenteredDialog({ open, onClose, titleId, children, className }: Props) {
  const deviceFrameEl = useDeviceFrameEl()
  const [visible, setVisible] = useState(open)
  const [closing, setClosing] = useState(false)

  const requestClose = useCallback(() => {
    setClosing(true)
  }, [])

  useEffect(() => {
    if (open) {
      setVisible(true)
      setClosing(false)
      return
    }
    if (visible) {
      setClosing(true)
    }
  }, [open, visible])

  const finishClose = useCallback(() => {
    setClosing(false)
    setVisible(false)
    onClose()
  }, [onClose])

  const handleAnimationEnd = useCallback(() => {
    if (closing) finishClose()
  }, [closing, finishClose])

  useBottomSheet(visible && !closing, requestClose)

  if (!visible) return null

  const dialogClass = [styles.dialog, closing ? styles.dialogClosing : '', className]
    .filter(Boolean)
    .join(' ')

  const overlay = (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      role="presentation"
    >
      <button
        type="button"
        className={styles.backdrop}
        onClick={requestClose}
        aria-label="Close"
      />
      <div className={styles.centerZone}>
        <div
          className={dialogClass}
          role="dialog"
          aria-modal="true"
          aria-labelledby={titleId}
          onAnimationEnd={handleAnimationEnd}
        >
          {children}
        </div>
      </div>
    </div>
  )

  return deviceFrameEl ? createPortal(overlay, deviceFrameEl) : overlay
}
