import { createPortal } from 'react-dom'
import { useCallback, useEffect, useState } from 'react'
import {
  IconCheck,
  IconChevronLeft,
  IconChevronRight,
  IconX,
} from '@tabler/icons-react'
import { useBottomSheet, useDeviceFrameEl } from '../../ui/useBottomSheet'
import heroBlock from '../../../assets/promo-page/hero-block.png'
import ctaPhoto from '../../../assets/promo-page/cta-photo.png'
import {
  PROMO_BENEFITS,
  PROMO_EXD_CASHBACK_STEPS,
  PROMO_HOW_IT_WORKS,
  PROMO_TIERS,
} from './promoPageContent'
import styles from './ExnessRewardsPromoModal.module.css'

const TITLE_ID = 'exness-rewards-promo-title'

type Props = {
  open: boolean
  onClose: () => void
}

function StepCards({ steps, className }: { steps: typeof PROMO_HOW_IT_WORKS; className?: string }) {
  return (
    <div className={`${styles.stepList} ${className ?? ''}`}>
      {steps.map((step, index) => (
        <article key={step.title} className={styles.stepCard}>
          <span className={styles.stepNum} aria-hidden>
            {index + 1}
          </span>
          <h3 className={styles.stepTitle}>{step.title}</h3>
          <p className={styles.stepBody}>
            {step.body}
            {step.linkLabel ? (
              <>
                {' '}
                <span className={styles.stepLink}>{step.linkLabel}</span>
              </>
            ) : null}
          </p>
        </article>
      ))}
    </div>
  )
}

function CarouselDots({
  count,
  activeIndex,
  onSelect,
  label,
}: {
  count: number
  activeIndex: number
  onSelect: (index: number) => void
  label: string
}) {
  return (
    <div className={styles.dots} role="tablist" aria-label={label}>
      {Array.from({ length: count }, (_, i) => (
        <button
          key={i}
          type="button"
          role="tab"
          className={`${styles.dot} ${i === activeIndex ? styles.dotActive : ''}`}
          aria-selected={i === activeIndex}
          aria-label={`Slide ${i + 1} of ${count}`}
          onClick={() => onSelect(i)}
        />
      ))}
    </div>
  )
}

export function ExnessRewardsPromoModal({ open, onClose }: Props) {
  const deviceFrameEl = useDeviceFrameEl()
  const [visible, setVisible] = useState(open)
  const [closing, setClosing] = useState(false)
  const [tierIndex, setTierIndex] = useState(0)
  const [benefitIndex, setBenefitIndex] = useState(0)

  const requestClose = useCallback(() => {
    setClosing(true)
  }, [])

  useEffect(() => {
    if (open) {
      setVisible(true)
      setClosing(false)
      return
    }
    if (visible) {
      setClosing(true)
    }
  }, [open, visible])

  const finishClose = useCallback(() => {
    setClosing(false)
    setVisible(false)
    onClose()
  }, [onClose])

  const handleAnimationEnd = useCallback(() => {
    if (closing) finishClose()
  }, [closing, finishClose])

  useBottomSheet(visible && !closing, requestClose)

  if (!visible) return null

  const tier = PROMO_TIERS[tierIndex]
  const benefit = PROMO_BENEFITS[benefitIndex]

  const overlay = (
    <div
      className={`${styles.overlay} ${closing ? styles.overlayClosing : ''}`}
      role="presentation"
    >
      <button type="button" className={styles.backdrop} onClick={requestClose} aria-label="Close" />
      <div
        className={`${styles.panel} ${closing ? styles.panelClosing : ''}`}
        role="dialog"
        aria-modal="true"
        aria-labelledby={TITLE_ID}
        onAnimationEnd={handleAnimationEnd}
      >
        <div className={styles.statusBar} aria-hidden>
          <span className={styles.statusTime}>9:41</span>
        </div>

        <header className={styles.header}>
          <button type="button" className={styles.closeBtn} onClick={requestClose} aria-label="Close">
            <IconX size={24} stroke={2} aria-hidden />
          </button>
        </header>

        <div className={styles.scroll}>
          <div className={styles.content}>
            <section className={styles.hero} aria-labelledby={TITLE_ID}>
              <img className={styles.heroBlockImage} src={heroBlock} alt="" aria-hidden />
              <div className={styles.heroText}>
                <h1 id={TITLE_ID} className={styles.heroTitle}>
                  Trade, earn rewards, and level up for exclusive benefits
                </h1>
                <p className={styles.heroSubtitle}>
                  Earn our rewards, Exness Dollars (EXD), by trading to increase your status and turn
                  them into withdrawable cashback.
                </p>
              </div>
            </section>

            <section className={styles.sectionBlock} aria-labelledby="promo-how-it-works">
              <h2 id="promo-how-it-works" className={styles.sectionTitle}>
                How it works
              </h2>
              <StepCards steps={PROMO_HOW_IT_WORKS} />
            </section>

            <section className={styles.sectionBlock} aria-labelledby="promo-tiers">
              <h2 id="promo-tiers" className={styles.sectionTitle}>
                Tiers and their perks
              </h2>
              <div className={styles.carouselWrap}>
                <article className={`${styles.carouselCard} ${styles.tierCard}`}>
                  <div className={styles.tierHeader}>
                    <h3 className={styles.tierName}>{tier.name}</h3>
                    <img className={styles.tierImage} src={tier.image} alt="" />
                  </div>
                  <div>
                    <p className={styles.tierBenefitsTitle}>Benefits</p>
                    {tier.benefits.map((row) => (
                      <div
                        key={row.label}
                        className={`${styles.tierBenefitRow} ${row.included ? styles.tierBenefitIncluded : styles.tierBenefitExcluded}`}
                      >
                        {row.included ? (
                          <IconCheck size={16} stroke={2} aria-hidden />
                        ) : (
                          <IconX size={16} stroke={2} aria-hidden />
                        )}
                        <span>{row.label}</span>
                      </div>
                    ))}
                  </div>
                </article>
                <div className={styles.carouselNav}>
                  <button
                    type="button"
                    className={styles.carouselNavBtn}
                    aria-label="Previous tier"
                    disabled={tierIndex === 0}
                    onClick={() => setTierIndex((i) => Math.max(0, i - 1))}
                  >
                    <IconChevronLeft size={18} stroke={2} aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={styles.carouselNavBtn}
                    aria-label="Next tier"
                    disabled={tierIndex >= PROMO_TIERS.length - 1}
                    onClick={() => setTierIndex((i) => Math.min(PROMO_TIERS.length - 1, i + 1))}
                  >
                    <IconChevronRight size={18} stroke={2} aria-hidden />
                  </button>
                </div>
              </div>
              <CarouselDots
                count={PROMO_TIERS.length}
                activeIndex={tierIndex}
                onSelect={setTierIndex}
                label="Tier slides"
              />
            </section>

            <section className={styles.sectionBlock} aria-labelledby="promo-benefits">
              <h2 id="promo-benefits" className={styles.sectionTitle}>
                What you get with Exness Rewards
              </h2>
              <div className={styles.carouselWrap}>
                <article className={`${styles.carouselCard} ${styles.benefitCard}`}>
                  <div className={styles.benefitImageWrap}>
                    <img className={styles.benefitImage} src={benefit.image} alt="" />
                  </div>
                  <h3 className={styles.stepTitle}>{benefit.title}</h3>
                  <p className={styles.stepBody}>{benefit.body}</p>
                </article>
                <div className={styles.carouselNav}>
                  <button
                    type="button"
                    className={styles.carouselNavBtn}
                    aria-label="Previous benefit"
                    disabled={benefitIndex === 0}
                    onClick={() => setBenefitIndex((i) => Math.max(0, i - 1))}
                  >
                    <IconChevronLeft size={18} stroke={2} aria-hidden />
                  </button>
                  <button
                    type="button"
                    className={styles.carouselNavBtn}
                    aria-label="Next benefit"
                    disabled={benefitIndex >= PROMO_BENEFITS.length - 1}
                    onClick={() => setBenefitIndex((i) => Math.min(PROMO_BENEFITS.length - 1, i + 1))}
                  >
                    <IconChevronRight size={18} stroke={2} aria-hidden />
                  </button>
                </div>
              </div>
              <CarouselDots
                count={PROMO_BENEFITS.length}
                activeIndex={benefitIndex}
                onSelect={setBenefitIndex}
                label="Benefit slides"
              />
            </section>

            <section className={styles.sectionBlock} aria-labelledby="promo-exd-cashback">
              <h2 id="promo-exd-cashback" className={styles.sectionTitle}>
                How EXD turns into cashback
              </h2>
              <StepCards steps={PROMO_EXD_CASHBACK_STEPS} />
            </section>

            <section className={styles.ctaCard} aria-labelledby="promo-cta-title">
              <img className={styles.ctaPhoto} src={ctaPhoto} alt="" />
              <div className={styles.ctaContent}>
                <div>
                  <h2 id="promo-cta-title" className={styles.ctaTitle}>
                    Get rewarded like a pro
                  </h2>
                  <div className={styles.ctaBody}>
                    <p>You’re not just trading, you’re building something.</p>
                    <p>
                      Keep trading to raise your status, earn cashback, and unlock exclusive
                      rewards.
                    </p>
                  </div>
                </div>
                <button type="button" className={styles.ctaBtn}>
                  Trade now
                </button>
              </div>
              <div className={styles.ctaSpacer} aria-hidden />
            </section>

            <p className={styles.terms}>
              <button type="button" className={styles.termsLink}>
                Exness Rewards
              </button>
              <span className={styles.termsPlain}> and </span>
              <button type="button" className={styles.termsLink}>
                Exness Dollars
              </button>
              <span className={styles.termsPlain}> terms and conditions apply</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  )

  return deviceFrameEl ? createPortal(overlay, deviceFrameEl) : overlay
}
