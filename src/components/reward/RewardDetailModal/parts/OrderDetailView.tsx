import { DetailFieldList, DetailHero, chipClassFor } from './DetailHero'
import type { OrderInPack } from '../configs/types'
import styles from '../RewardDetailModal.module.css'

type Props = {
  order: OrderInPack
  onOrderClick?: (orderNum: string) => void
  onExdDebitedClick?: () => void
  onCashbackConversionClick?: () => void
  onCashbackRateClick?: () => void
}

export function OrderDetailContent({
  order,
  onOrderClick,
  onExdDebitedClick,
  onCashbackConversionClick,
  onCashbackRateClick,
}: Props) {
  return (
    <div className={styles.scroll}>
      <DetailHero
        heroIcon={order.detail.heroIcon}
        amount={order.detail.amount}
        amountTone={order.detail.amountTone}
        chipText={order.detail.chip.text}
        chipClass={chipClassFor(order.detail.chip.tone, styles)}
      />
      <DetailFieldList
        rows={order.detail.details}
        onOrderClick={onOrderClick}
        onExdDebitedClick={onExdDebitedClick}
        onCashbackConversionClick={onCashbackConversionClick}
        onCashbackRateClick={onCashbackRateClick}
      />
    </div>
  )
}
