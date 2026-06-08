import { ModalSheet } from '../../../ui/ModalSheet'
import type { TradingOrderRewardsEntry } from '../../../../domain/reward/tradingOrder'
import { ClosedOrderPanel, type ClosedOrderPanelProps } from './ClosedOrderPanel'

type Props = Omit<ClosedOrderPanelProps, 'layout' | 'titleId'> & {
  open: boolean
}

export function ClosedOrderSheet({ open, ...panelProps }: Props) {
  const titleId = 'closed-order-sheet-title'

  return (
    <ModalSheet
      open={open}
      onClose={panelProps.onClose}
      titleId={titleId}
      detent="large"
      stacked
    >
      <ClosedOrderPanel {...panelProps} titleId={titleId} layout="modal" />
    </ModalSheet>
  )
}
