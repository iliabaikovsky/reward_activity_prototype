import type { ReactNode } from 'react'
import { AppH1, AppH3 } from './AppHeading'

type Props = {
  children: ReactNode
  /** primary = H1 36px; secondary = H3 20px (dual-currency Others) */
  variant?: 'primary' | 'secondary'
}

/** Filter / drill-down total — Figma heading scale via AppHeading */
export function SummaryHeroAmount({ children, variant = 'primary' }: Props) {
  if (variant === 'secondary') {
    return <AppH3>{children}</AppH3>
  }
  return <AppH1>{children}</AppH1>
}
