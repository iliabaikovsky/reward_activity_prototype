import { IconX } from '@tabler/icons-react'
import { ModalSheet } from '../../../ui/ModalSheet'
import {
  formatSharePercentToken,
  formatSpreadShareLead,
  formatSpreadShareSecondary,
  SPREAD_SHARE_SHEET_TITLE,
} from '../configs/rebateShareExplainer'
import styles from './EarningRateSheet.module.css'

type Props = {
  open: boolean
  sharePercent: number
  maxSharePercent: number
  onClose: () => void
}

export function RebateShareSheet({ open, sharePercent, maxSharePercent, onClose }: Props) {
  const titleId = 'spread-share-sheet-title'

  return (
    <ModalSheet open={open} onClose={onClose} titleId={titleId} detent="medium" stacked>
      <div className={styles.sheetBody}>
        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={onClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
          <h2 className={styles.navTitle} id={titleId}>
            {SPREAD_SHARE_SHEET_TITLE}
          </h2>
          <span aria-hidden className={styles.headerSpacer} />
        </header>

        <div className={styles.scroll}>
          <div className={styles.hero}>
            <p className={styles.rateValue}>{formatSharePercentToken(sharePercent)}%</p>
          </div>
          <p className={styles.lead}>{formatSpreadShareLead(maxSharePercent)}</p>
          <p className={styles.secondary}>{formatSpreadShareSecondary(maxSharePercent)}</p>
        </div>
      </div>
    </ModalSheet>
  )
}
