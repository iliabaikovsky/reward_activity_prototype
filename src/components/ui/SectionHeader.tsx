import { IconChevronRight } from '@tabler/icons-react'
import { appHeadingStyles } from './AppHeading'
import styles from './SectionHeader.module.css'

type Props = {
  title: string
  showChevron?: boolean
  onClick?: () => void
  ariaLabel?: string
  className?: string
}

export function SectionHeader({
  title,
  showChevron = true,
  onClick,
  ariaLabel,
  className,
}: Props) {
  const inner = (
    <>
      <span className={`${appHeadingStyles.h3} ${styles.sectionTitle}`}>{title}</span>
      {showChevron ? (
        <IconChevronRight className={styles.chevronIcon} size={24} stroke={2} aria-hidden />
      ) : null}
    </>
  )

  if (showChevron) {
    return (
      <button
        type="button"
        className={`${styles.sectionTitleRow} ${className ?? ''}`.trim()}
        onClick={onClick}
        aria-label={ariaLabel ?? title}
      >
        {inner}
      </button>
    )
  }

  return (
    <div className={`${styles.sectionTitleRow} ${styles.sectionTitleRowStatic} ${className ?? ''}`.trim()}>
      {inner}
    </div>
  )
}
