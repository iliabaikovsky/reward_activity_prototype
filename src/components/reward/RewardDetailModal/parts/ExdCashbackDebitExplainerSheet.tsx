import { IconX } from '@tabler/icons-react'
import { AppH4 } from '../../../ui/AppHeading'
import { ModalSheet } from '../../../ui/ModalSheet'
import {
  EXD_DEBIT_SHEET_LEAD,
  EXD_DEBIT_SHEET_SECONDARY,
  EXD_DEBIT_SHEET_TITLE,
} from '../configs/cashbackExdDebitExplainer'
import styles from './EarningRateSheet.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

export function ExdCashbackDebitExplainerSheet({ open, onClose }: Props) {
  const titleId = 'exd-debit-sheet-title'

  return (
    <ModalSheet open={open} onClose={onClose} titleId={titleId} detent="medium" stacked>
      <div className={styles.sheetBody}>
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
          <AppH4 className={styles.navTitle} id={titleId}>
            {EXD_DEBIT_SHEET_TITLE}
          </AppH4>
          <span aria-hidden className={styles.headerSpacer} />
        </header>

        <div className={styles.scroll}>
          <p className={styles.lead}>{EXD_DEBIT_SHEET_LEAD}</p>
          <p className={styles.secondary}>{EXD_DEBIT_SHEET_SECONDARY}</p>
        </div>
      </div>
    </ModalSheet>
  )
}
