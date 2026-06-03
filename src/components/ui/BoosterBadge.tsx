import styles from './BoosterBadge.module.css'

/** Figma 41788:19744 — multiplier в list; 39942:36880 — tier в деталке Booster */
export type BoosterBadgeVariant = 'multiplier' | 'tier'

type Props = {
  variant: BoosterBadgeVariant
  children: string
}

export function BoosterBadge({ variant, children }: Props) {
  return <span className={`${styles.badge} ${styles[variant]}`}>{children}</span>
}
