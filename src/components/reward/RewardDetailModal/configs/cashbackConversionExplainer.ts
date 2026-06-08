/** Converted on row + info sheet (EXD → USD at 1:1; same label for upcoming and credited legs). */

export const CONVERTED_ON_LABEL = 'Converted on'

export function isCashbackConversionLabel(label: string): boolean {
  return label === CONVERTED_ON_LABEL
}

export const CONVERSION_SHEET_TITLE = 'EXD to USD cashback'

export const CONVERSION_SHEET_LEAD =
  'EXD debited from your trading account for spread on this order is converted to USD cashback at 1 EXD = 1 USD. The amount shown above is the USD result of that conversion for this order.'

export const CONVERSION_SHEET_SECONDARY =
  'Conversion happens when EXD is debited for spread on the order (1 EXD = 1 USD). The USD amount above is already converted even while the leg is Upcoming. Credits on at pack level is when USD is scheduled to post to your trading account; Converted on here is that conversion timestamp for this order.'
