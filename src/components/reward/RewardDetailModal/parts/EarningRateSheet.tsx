import { IconX } from '@tabler/icons-react'
import { ModalSheet } from '../../../ui/ModalSheet'
import {
  EARNING_RATE_LEAD,
  EARNING_RATE_SECONDARY,
  EARNING_RATE_SHEET_TITLE,
} from '../configs/earningRateExplainer'
import styles from './EarningRateSheet.module.css'

type Props = {
  open: boolean
  rateValue: string
  onClose: () => void
}

export function EarningRateSheet({ open, rateValue, onClose }: Props) {
  const titleId = 'earning-rate-sheet-title'

  return (
    <ModalSheet open={open} onClose={onClose} titleId={titleId} detent="medium" stacked>
      <div className={styles.sheetBody}>
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
          <h2 className={styles.navTitle} id={titleId}>
            {EARNING_RATE_SHEET_TITLE}
          </h2>
          <span aria-hidden className={styles.headerSpacer} />
        </header>

        <div className={styles.scroll}>
          <div className={styles.hero}>
            <p className={styles.rateValue}>{rateValue}</p>
          </div>

          <p className={styles.lead}>{EARNING_RATE_LEAD}</p>
          <p className={styles.secondary}>{EARNING_RATE_SECONDARY}</p>
        </div>
      </div>
    </ModalSheet>
  )
}
