import { IconChevronRight } from '@tabler/icons-react'
import styles from './SectionHeader.module.css'

type Props = {
  title: string
  showChevron?: boolean
  onClick?: () => void
}

export function SectionHeader({ title, showChevron = true, onClick }: Props) {
  const inner = (
    <>
      <span className={styles.sectionTitle} role="heading" aria-level={2}>
        {title}
      </span>
      {showChevron ? (
        <IconChevronRight className={styles.chevronIcon} size={24} stroke={2} aria-hidden />
      ) : null}
    </>
  )

  if (showChevron) {
    return (
      <button type="button" className={styles.sectionTitleRow} onClick={onClick}>
        {inner}
      </button>
    )
  }

  return <div className={`${styles.sectionTitleRow} ${styles.sectionTitleRowStatic}`}>{inner}</div>
}
