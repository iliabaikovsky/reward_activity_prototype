import { LIFECYCLE_STEPS } from './lifecycleSteps'

export type PrototypeSearchParams = {
  /** UserTesting: hide lifecycle rail. */
  utMode: boolean
  /** 0-based step from `?step=` (URL is 1-based). */
  initialStepIndex: number
}

export function parsePrototypeSearchParams(
  search = typeof window !== 'undefined' ? window.location.search : '',
): PrototypeSearchParams {
  const params = new URLSearchParams(search)
  const utMode = params.get('ut') === '1'
  const stepParam = params.get('step')
  let initialStepIndex = 0

  if (stepParam) {
    const n = parseInt(stepParam, 10)
    if (Number.isFinite(n) && n >= 1 && n <= LIFECYCLE_STEPS.length) {
      initialStepIndex = n - 1
    }
  }

  return {
    utMode,
    initialStepIndex,
  }
}
