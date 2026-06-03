import { createPortal } from 'react-dom'
import { useCallback, useRef, useState, type ReactNode, type TouchEvent } from 'react'
import { useBottomSheet, useDeviceFrameEl } from './useBottomSheet'
import styles from './ModalSheet.module.css'

export type ModalSheetDetent = 'medium' | 'large'

const DISMISS_DRAG_PX = 80

type Props = {
  open: boolean
  /** Escape key and default scrim/swipe dismiss. */
  onClose: () => void
  /** Scrim tap + swipe down; defaults to `onClose`. Use for full dismiss while `onClose` pops nav stack. */
  onScrimDismiss?: () => void
  titleId?: string
  detent?: ModalSheetDetent
  panelClassName?: string
  children: ReactNode
}

export function ModalSheet({
  open,
  onClose,
  onScrimDismiss,
  titleId,
  detent = 'medium',
  panelClassName,
  children,
}: Props) {
  const deviceFrameEl = useDeviceFrameEl()
  const dragStartYRef = useRef<number | null>(null)
  const dragOffsetYRef = useRef(0)
  const [dragOffsetY, setDragOffsetY] = useState(0)

  const dismissFromScrim = onScrimDismiss ?? onClose

  useBottomSheet(open, onClose)

  const resetDrag = useCallback(() => {
    dragStartYRef.current = null
    dragOffsetYRef.current = 0
    setDragOffsetY(0)
  }, [])

  const handleGrabTouchStart = useCallback((e: TouchEvent) => {
    const y = e.touches[0]?.clientY
    if (y == null) return
    dragStartYRef.current = y
    setDragOffsetY(0)
  }, [])

  const handleGrabTouchMove = useCallback((e: TouchEvent) => {
    if (dragStartYRef.current == null) return
    const y = e.touches[0]?.clientY
    if (y == null) return
    const next = Math.max(0, y - dragStartYRef.current)
    dragOffsetYRef.current = next
    setDragOffsetY(next)
  }, [])

  const handleGrabTouchEnd = useCallback(() => {
    if (dragStartYRef.current == null) return
    if (dragOffsetYRef.current >= DISMISS_DRAG_PX) {
      dismissFromScrim()
    }
    resetDrag()
  }, [dismissFromScrim, resetDrag])

  if (!open) return null

  const panelClasses = [
    styles.panel,
    detent === 'large' ? styles.panelLarge : styles.panelMedium,
    dragOffsetY > 0 ? styles.panelDragging : '',
    panelClassName,
  ]
    .filter(Boolean)
    .join(' ')

  const panelStyle =
    dragOffsetY > 0 ? { transform: `translateY(${dragOffsetY}px)` } : undefined

  const overlay = (
    <div className={styles.overlay} role="presentation">
      <button
        type="button"
        className={styles.backdrop}
        onClick={dismissFromScrim}
        aria-label="Close"
      />
      <div
        className={panelClasses}
        style={panelStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
      >
        <div
          className={styles.grabberZone}
          onTouchStart={handleGrabTouchStart}
          onTouchMove={handleGrabTouchMove}
          onTouchEnd={handleGrabTouchEnd}
          onTouchCancel={resetDrag}
        >
          <div className={styles.grabber} aria-hidden />
        </div>
        <div className={styles.panelBody}>{children}</div>
      </div>
    </div>
  )

  return deviceFrameEl ? createPortal(overlay, deviceFrameEl) : overlay
}
