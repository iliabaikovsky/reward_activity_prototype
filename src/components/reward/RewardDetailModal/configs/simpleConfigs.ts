import type { SimpleConfig, SimpleVariantKey } from './types'
import {
  AVAILABLE_REWARDS_WALLET,
  FROM_WALLET_LABEL,
  TO_WALLET_LABEL,
} from './packDetailRows'

export const SIMPLE_CONFIG: Record<SimpleVariantKey, SimpleConfig> = {
  'transfer-exd': {
    navTitle: 'Transfer',
    chip: { text: 'Completed', tone: 'success' },
    heroIcon: 'transfer',
    amount: '30.00 EXD',
    details: [
      { label: 'Completed on', value: 'Mar 21, 2026, 09:30 UTC' },
      { label: FROM_WALLET_LABEL, value: AVAILABLE_REWARDS_WALLET },
      { label: 'To account', value: '#12345678' },
    ],
  },
  'promo-gift': {
    navTitle: 'Birthday gift',
    chip: { text: 'Credited', tone: 'success' },
    heroIcon: 'gift',
    amount: '+50.00 EXD',
    details: [
      { label: 'Credited on', value: 'Mar 19, 2026, 16:15 UTC' },
      { label: TO_WALLET_LABEL, value: AVAILABLE_REWARDS_WALLET },
    ],
    celebration: {
      message: 'Best wishes! ✨',
      imageAlt: 'Metallic gift tiles with a gift box icon',
    },
  },
  'exd-adjustment': {
    navTitle: 'EXD adjustment',
    chip: { text: 'Adjusted', tone: 'neutral' },
    heroIcon: 'crownOff',
    amount: '-0.40 EXD',
    details: [
      { label: 'Processed on', value: 'Mar 18, 2026, 23:59 UTC' },
      { label: FROM_WALLET_LABEL, value: AVAILABLE_REWARDS_WALLET },
    ],
  },
}
