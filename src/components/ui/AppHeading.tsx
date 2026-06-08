import type { HTMLAttributes, ReactNode } from 'react'
import styles from './AppHeading.module.css'

type HeadingProps = HTMLAttributes<HTMLHeadingElement> & { children: ReactNode }

function cx(base: string, className?: string) {
  return className ? `${base} ${className}` : base
}

/** 36 / 48 — iOS Header H1 */
export function AppH1({ className, children, ...rest }: HeadingProps) {
  return (
    <h1 className={cx(styles.h1, className)} {...rest}>
      {children}
    </h1>
  )
}

/** 24 / 32 — iOS Header H2 */
export function AppH2({ className, children, ...rest }: HeadingProps) {
  return (
    <h2 className={cx(styles.h2, className)} {...rest}>
      {children}
    </h2>
  )
}

/** 20 / 28 — iOS Header H3 */
export function AppH3({ className, children, ...rest }: HeadingProps) {
  return (
    <h3 className={cx(styles.h3, className)} {...rest}>
      {children}
    </h3>
  )
}

/** 16 / 24 — iOS Header H4 (nav bars, sheet titles) */
export function AppH4({ className, children, ...rest }: HeadingProps) {
  return (
    <h4 className={cx(styles.h4, className)} {...rest}>
      {children}
    </h4>
  )
}

/** For headings inside buttons — same styles, no heading element */
export const appHeadingStyles = styles
