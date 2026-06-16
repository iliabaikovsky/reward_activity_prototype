import { LIFECYCLE_STEPS } from './lifecycleSteps'

export type PrototypeSearchParams = {
  /** UserTesting: hide lifecycle rail, show question panel. */
  utMode: boolean
  /** 0-based step from `?step=` (URL is 1-based). */
  initialStepIndex: number
  /** UT mode — step fixed; no glass rail. */
  lockStep: boolean
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
    lockStep: utMode,
  }
}

/** 1-based chapter URL for UserTesting tasks. */
export function usabilityTestChapterUrl(chapterIndex: number, origin = window.location.origin): string {
  const step = chapterIndex + 1
  const path = window.location.pathname.replace(/\/$/, '') || '/'
  return `${origin}${path}?ut=1&step=${step}`
}
