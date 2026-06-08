import { IconX } from '@tabler/icons-react'
import { AppH4 } from '../../../ui/AppHeading'
import { ModalSheet } from '../../../ui/ModalSheet'
import {
  CONVERSION_SHEET_LEAD,
  CONVERSION_SHEET_SECONDARY,
  CONVERSION_SHEET_TITLE,
} from '../configs/cashbackConversionExplainer'
import styles from './EarningRateSheet.module.css'

type Props = {
  open: boolean
  onClose: () => void
}

export function CashbackConversionSheet({ open, onClose }: Props) {
  const titleId = 'cashback-conversion-sheet-title'

  return (
    <ModalSheet open={open} onClose={onClose} titleId={titleId} detent="medium" stacked>
      <div className={styles.sheetBody}>
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
          <AppH4 className={styles.navTitle} id={titleId}>
            {CONVERSION_SHEET_TITLE}
          </AppH4>
          <span aria-hidden className={styles.headerSpacer} />
        </header>
        <div className={styles.scroll}>
          <p className={styles.lead}>{CONVERSION_SHEET_LEAD}</p>
          <p className={styles.secondary}>{CONVERSION_SHEET_SECONDARY}</p>
        </div>
      </div>
    </ModalSheet>
  )
}
