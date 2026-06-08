import { useEffect } from 'react'
import { useDeviceFrameEl } from '../../context/DeviceFrameContext'

let bodyLockCount = 0
let scrollLockCount = 0
let savedBodyOverflow = ''
let savedScrollOverflow = ''

function getDeviceFrameScrollEl(frameEl: HTMLDivElement | null): HTMLElement | null {
  return frameEl?.querySelector<HTMLElement>('.device-frame-scroll') ?? null
}

function lockBody() {
  if (bodyLockCount === 0) {
    savedBodyOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
  }
  bodyLockCount += 1
}

function unlockBody() {
  bodyLockCount = Math.max(0, bodyLockCount - 1)
  if (bodyLockCount === 0) {
    document.body.style.overflow = savedBodyOverflow
  }
}

function lockScroll(scrollEl: HTMLElement) {
  if (scrollLockCount === 0) {
    savedScrollOverflow = scrollEl.style.overflow
    scrollEl.style.overflow = 'hidden'
  }
  scrollLockCount += 1
}

function unlockScroll(scrollEl: HTMLElement) {
  scrollLockCount = Math.max(0, scrollLockCount - 1)
  if (scrollLockCount === 0) {
    scrollEl.style.overflow = savedScrollOverflow
  }
}

/** Сброс после размонтирования модалки без exit-анимации (chart и т.п.). */
export function releaseDeviceFrameScrollLock() {
  bodyLockCount = 0
  scrollLockCount = 0
  document.body.style.overflow = ''
  const scrollEl = document.querySelector<HTMLElement>('.device-frame-scroll')
  if (scrollEl) scrollEl.style.overflow = ''
}

/** Scroll lock для body и `.device-frame-scroll` при открытом sheet. */
export function useBottomSheet(open: boolean, onClose: () => void, escapeEnabled = true) {
  const deviceFrameEl = useDeviceFrameEl()

  useEffect(() => {
    if (!open) return
    const scrollEl = getDeviceFrameScrollEl(deviceFrameEl)
    lockBody()
    if (scrollEl) lockScroll(scrollEl)
    return () => {
      unlockBody()
      if (scrollEl) unlockScroll(scrollEl)
    }
  }, [open, deviceFrameEl])

  useEffect(() => {
    if (!open || !escapeEnabled) return
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open, onClose, escapeEnabled])
}

export { useDeviceFrameEl }
