import type { SimpleConfig, SimpleVariantKey } from './types'

export const SIMPLE_CONFIG: Record<SimpleVariantKey, SimpleConfig> = {
  'transfer-exd': {
    navTitle: 'Transfer',
    chip: { text: 'Completed', tone: 'neutral' },
    heroIcon: 'transfer',
    amount: '30.00 EXD',
    details: [
      { label: 'To account', value: '#1234678' },
      { label: 'From wallet', value: 'Available rewards' },
      { label: 'Initiated', value: '15 Jan 2026, 16:05' },
      { label: 'Completed', value: '15 Jan 2026, 16:06' },
      { label: 'Method', value: 'Instant transfer' },
      { label: 'Transfer ID', value: 'TRF-77821-EXD' },
    ],
  },
  'promo-gift': {
    navTitle: 'Birthday gift',
    chip: { text: 'Promo', tone: 'success' },
    heroIcon: 'gift',
    amount: '+50.00 EXD',
    details: [
      { label: 'Message', value: 'Best wishes! ✨' },
      { label: 'Campaign', value: 'Spring campaign 2026' },
      { label: 'Credited on', value: '19 Mar 2026, 16:15' },
      { label: 'Wallet', value: 'Available rewards' },
      { label: 'Eligibility', value: 'Active trader · Ultimate' },
      { label: 'Promo code', value: 'SPR26-EXNESS' },
      { label: 'Reference', value: 'PRM-GIFT-55218' },
    ],
  },
  'exd-adjustment': {
    navTitle: 'EXD adjustment',
    chip: { text: 'Adjustment', tone: 'negative' },
    heroIcon: 'crownOff',
    amount: '-0.40 EXD',
    amountTone: 'negative',
    details: [
      { label: 'Reason', value: 'Balance correction' },
      { label: 'Account', value: '#12345678' },
      { label: 'Processed on', value: '18 Mar 2026, 23:59' },
      { label: 'Wallet', value: 'Available rewards' },
      { label: 'Case reference', value: 'ADJ-2026-008812' },
      { label: 'Support ticket', value: '#SUP-441928' },
    ],
  },
}
