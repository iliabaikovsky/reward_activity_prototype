import type { RebateDemoState } from './rebateSimulatorSteps'
import { parseSignedAmount } from './rebateSimulatorSteps'

export type RebateLedgerLine = {
  id: string
  slotLabel: string
  usd: string
  exd: string
  payoutOn: string
  status: string
}

function seedFromString(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (h * 31 + s.charCodeAt(i)) | 0
  return Math.abs(h) + 1
}

/** Детерминированный список слотов под `pendingCount` (прототип). */
export function buildRebateLedgerLines(
  rebate: RebateDemoState,
  scenarioId: string,
): RebateLedgerLine[] {
  const n = rebate.pendingCount
  const usdTotal = parseSignedAmount(rebate.pendingUsd)
  const exdTotal = parseSignedAmount(rebate.pendingExd)
  if (n <= 0 || (usdTotal <= 0 && exdTotal <= 0)) return []

  const seed = seedFromString(scenarioId)
  const lines: RebateLedgerLine[] = []
  let remU = usdTotal
  let remE = exdTotal

  for (let i = 0; i < n; i++) {
    const remaining = n - i
    const pseudo = ((i * 7919 + seed) % 997) / 997
    const usdPart =
      remaining === 1
        ? Math.round(remU * 100) / 100
        : Math.max(0.01, Math.round((remU * (0.28 + pseudo * 0.55)) * 100) / 100)
    const pseudo2 = ((i * 5003 + seed * 7) % 997) / 997
    const exdPart =
      remaining === 1
        ? Math.round(remE * 100) / 100
        : Math.max(0.01, Math.round((remE * (0.28 + pseudo2 * 0.55)) * 100) / 100)

    remU = Math.max(0, remU - usdPart)
    remE = Math.max(0, remE - exdPart)

    const day = 1 + ((i * 17 + seed) % 28)
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun'] as const
    const month = months[(i + seed) % months.length]
    const onHold = rebate.showAccountAlert && i < rebate.onHoldUsdCount
    lines.push({
      id: `rb-slot-${i}`,
      slotLabel: `Trading day · ${month} ${day}, 2026`,
      usd: `+${usdPart.toFixed(2)} USD`,
      exd: `+${exdPart.toFixed(2)} EXD`,
      payoutOn:
        rebate.nextPayoutDate === '—'
          ? '—'
          : rebate.nextPayoutDate === 'Tomorrow'
            ? 'Tomorrow'
            : rebate.nextPayoutDate,
      status: onHold ? 'USD on hold · EXD queued' : 'Queued (T+60)',
    })
  }

  return lines
}
