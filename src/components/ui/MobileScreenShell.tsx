import type { ButtonHTMLAttributes, ReactNode } from 'react'
import { IconChevronLeft } from '@tabler/icons-react'
import styles from './MobileScreenShell.module.css'

type Theme = 'light' | 'onDark'

type Props = {
  theme?: Theme
  navVariant: 'backOnly' | 'titleWithActions'
  title?: string
  onBack?: () => void
  actions?: ReactNode
  children: ReactNode
  bottomSafe?: boolean
}

export function MobileStatusBar({ theme = 'light' }: { theme?: Theme }) {
  const themeClass = theme === 'onDark' ? styles.statusBarOnDark : styles.statusBarLight
  return (
    <div className={`${styles.statusBar} ${themeClass}`}>
      <span className={styles.statusTime}>9:41</span>
      <span className={styles.statusRight} aria-hidden />
    </div>
  )
}

export function MobileTopNav({
  theme = 'light',
  navVariant,
  title,
  onBack,
  actions,
}: Pick<Props, 'theme' | 'navVariant' | 'title' | 'onBack' | 'actions'>) {
  const btnClass = `${styles.navBtn} ${theme === 'onDark' ? styles.navBtnOnDark : styles.navBtnLight}`

  if (navVariant === 'backOnly') {
    return (
      <header className={styles.topNavBackOnly}>
        <button type="button" className={btnClass} onClick={onBack} aria-label="Back">
          <IconChevronLeft size={24} stroke={2} aria-hidden />
        </button>
      </header>
    )
  }

  return (
    <header className={styles.topNavTitleActions}>
      <button type="button" className={btnClass} onClick={onBack} aria-label="Back">
        <IconChevronLeft size={24} stroke={2} aria-hidden />
      </button>
      {title ? (
        <h1
          className={`${styles.navTitle} ${theme === 'light' ? styles.navTitleLight : styles.navTitleOnDark}`}
        >
          {title}
        </h1>
      ) : null}
      <div>{actions ?? <span className={btnClass} aria-hidden />}</div>
    </header>
  )
}

export function MobileBottomSafe() {
  return <div className={styles.bottomSafe} aria-hidden />
}

export function MobileNavButton({
  theme = 'light',
  children,
  className,
  ...props
}: ButtonHTMLAttributes<HTMLButtonElement> & { theme?: Theme }) {
  const btnClass = `${styles.navBtn} ${theme === 'onDark' ? styles.navBtnOnDark : styles.navBtnLight}${className ? ` ${className}` : ''}`
  return (
    <button type="button" className={btnClass} {...props}>
      {children}
    </button>
  )
}

export function MobileScreenShell({
  theme = 'light',
  navVariant,
  title,
  onBack,
  actions,
  children,
  bottomSafe = true,
}: Props) {
  return (
    <>
      <MobileStatusBar theme={theme} />
      <MobileTopNav
        theme={theme}
        navVariant={navVariant}
        title={title}
        onBack={onBack}
        actions={actions}
      />
      {children}
      {bottomSafe ? <MobileBottomSafe /> : null}
    </>
  )
}
