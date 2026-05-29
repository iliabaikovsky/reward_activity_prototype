/** Парсит сумму EXD из строки вида "+3.20 EXD" (сохраняет знак). */
export function parseExdAmount(amount: string): number {
  const m = amount.replace(/,/g, '').match(/([+-]?\d+(?:\.\d+)?)\s*EXD/i)
  if (!m) return 0
  const n = parseFloat(m[1])
  return Number.isFinite(n) ? n : 0
}

/** Абсолютное значение EXD (для split по ордерам). */
export function parseExdAbsolute(amount: string): number {
  return Math.abs(parseExdAmount(amount))
}

/** Форматирует EXD с знаком "+" для неотрицательных. */
export function formatExd(n: number): string {
  const sign = n >= 0 ? '+' : ''
  return `${sign}${n.toFixed(2)} EXD`
}

/** Первое число из строки баланса кошелька ("2.80 EXD"). */
export function parseWalletExdBalance(label: string): number {
  const raw = label.replace(/,/g, '').trim().split(/\s+/)[0] ?? '0'
  const n = parseFloat(raw)
  return Number.isFinite(n) ? n : 0
}
