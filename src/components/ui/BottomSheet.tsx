import { useId, type ReactNode } from 'react'
import { IconX } from '@tabler/icons-react'
import { ModalSheet } from './ModalSheet'
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

  return (
    <ModalSheet open={open} onClose={onClose} titleId={titleId} detent="medium">
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
    </ModalSheet>
  )
}
