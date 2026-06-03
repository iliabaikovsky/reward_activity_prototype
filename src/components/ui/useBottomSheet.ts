import { useEffect } from 'react'
import { useDeviceFrameEl } from '../../context/DeviceFrameContext'

/** Scroll lock для body и `.device-frame-scroll` при открытом sheet. */
export function useBottomSheet(open: boolean, onClose: () => void, escapeEnabled = true) {
  const deviceFrameEl = useDeviceFrameEl()

  useEffect(() => {
    if (!open) return
    const prevBody = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    const scrollEl = deviceFrameEl?.querySelector<HTMLElement>('.device-frame-scroll') ?? null
    const prevScroll = scrollEl?.style.overflow ?? ''
    if (scrollEl) scrollEl.style.overflow = 'hidden'
    return () => {
      document.body.style.overflow = prevBody
      if (scrollEl) scrollEl.style.overflow = prevScroll
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
