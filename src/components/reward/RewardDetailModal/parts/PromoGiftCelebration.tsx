import celebrationImage from '../../../../assets/promo-gift-celebration.png'
import styles from './PromoGiftCelebration.module.css'

type Props = {
  message: string
  imageAlt: string
}

export function PromoGiftCelebration({ message, imageAlt }: Props) {
  return (
    <section className={styles.block} aria-label="Birthday message">
      <p className={styles.message}>{message}</p>
      <div className={styles.imageFrame}>
        <img className={styles.image} src={celebrationImage} alt={imageAlt} />
      </div>
    </section>
  )
}
