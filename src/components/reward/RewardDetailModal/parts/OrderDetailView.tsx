import { DetailFieldList, DetailHero, chipClassFor } from './DetailHero'
import type { OrderInPack } from '../configs/types'
import styles from '../RewardDetailModal.module.css'

type Props = {
  order: OrderInPack
}

export function OrderDetailContent({ order }: Props) {
  return (
    <div className={styles.scroll}>
      <DetailHero
        heroIcon={order.detail.heroIcon}
        amount={order.detail.amount}
        amountTone={order.detail.amountTone}
        chipText={order.detail.chip.text}
        chipClass={chipClassFor(order.detail.chip.tone, styles)}
      />
      <DetailFieldList rows={order.detail.details} />
    </div>
  )
}
