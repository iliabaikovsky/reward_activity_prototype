import type { SimpleConfig, SimpleVariantKey } from './types'

export const SIMPLE_CONFIG: Record<SimpleVariantKey, SimpleConfig> = {
  'transfer-exd': {
    navTitle: 'Transfer',
    chip: { text: 'Completed', tone: 'success' },
    heroIcon: 'transfer',
    amount: '30.00 EXD',
    details: [
      { label: 'Completed on', value: 'Mar 21, 2026, 09:30 UTC' },
      { label: 'From', value: 'Available rewards' },
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
      { label: 'To', value: 'Available rewards' },
      { label: 'Comment', value: 'Best wishes! ✨' },
    ],
  },
  'exd-adjustment': {
    navTitle: 'EXD adjustment',
    chip: { text: 'Adjusted', tone: 'negative' },
    heroIcon: 'crownOff',
    amount: '-0.40 EXD',
    details: [
      { label: 'Processed on', value: 'Mar 18, 2026, 23:59 UTC' },
      { label: 'From', value: 'Available rewards' },
      { label: 'To account', value: '#12345678' },
      { label: 'Reason', value: 'Balance correction' },
    ],
  },
}
