import { createPortal } from 'react-dom'
import { useCallback, useEffect, useState } from 'react'
import { IconX } from '@tabler/icons-react'
import { useBottomSheet, useDeviceFrameEl } from '../../ui/useBottomSheet'
import exdCoin from '../../../assets/earn-rewards/exd-coin.png'
import styles from './EarnRewardsModal.module.css'

const TITLE_ID = 'earn-rewards-modal-title'

const CASHBACK_STEPS = [
  {
    title: 'Transfer EXD',
    body: 'Start by transferring your earned EXD to your trading account.',
  },
  {
    title: 'Trade',
    body: 'Make a trade and pay the usual spread or trading commissions. Up to 50% of these trading costs will be deducted from your EXD balance and converted into cashback. 1 EXD = 1 USD.',
  },
  {
    title: 'Get cashback the next day',
    body: 'This cashback is credited to your trading account balance the next day. Withdraw it or use it for more trading – the choice is yours.',
  },
] as const

type Props = {
  open: boolean
  onClose: () => void
}

export function EarnRewardsModal({ open, onClose }: Props) {
  const deviceFrameEl = useDeviceFrameEl()
  const [visible, setVisible] = useState(open)
  const [closing, setClosing] = useState(false)

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
        data-node-id="43730:1106"
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
            <section className={styles.introCard} aria-labelledby={TITLE_ID}>
              <div>
                <p className={styles.introTag}>Trade and level up</p>
                <h1 id={TITLE_ID} className={styles.introTitle}>
                  Trade, earn Exness Dollars, and level up your status
                </h1>
              </div>
              <div className={styles.introArt} aria-hidden>
                <img className={styles.introArtImage} src={exdCoin} alt="" />
              </div>
            </section>

            <section className={styles.section} aria-labelledby="earn-trade-exd">
              <h2 id="earn-trade-exd" className={styles.sectionTitle}>
                Trade and earn EXD
              </h2>
              <div className={styles.bodyText}>
                <p>It’s simple, you earn Exness Dollars (EXD) by trading.</p>
                <p>Keep in mind:</p>
                <ul className={styles.bulletList}>
                  <li>
                    EXD earnings may vary from trade to trade — your rate is personalized based on a
                    variety of live factors, including your trading activity and market conditions.
                  </li>
                  <li>
                    The minimum EXD you can receive per trade is 0.01 EXD, so for some small trades
                    you may not earn any.
                  </li>
                </ul>
              </div>
            </section>

            <section className={styles.section} aria-labelledby="earn-level-up">
              <h2 id="earn-level-up" className={styles.sectionTitle}>
                Level up your status
              </h2>
              <p className={styles.bodyText}>
                As you earn EXD, your status will increase, giving you access to even better benefits.
              </p>
            </section>

            <section className={styles.section} aria-labelledby="earn-cashback-flow">
              <h2 id="earn-cashback-flow" className={styles.sectionTitle}>
                How EXD turns into cashback
              </h2>
              <div className={styles.stepper}>
                {CASHBACK_STEPS.map((step, index) => (
                  <div key={step.title}>
                    <div className={styles.step}>
                      <span className={styles.stepNum} aria-hidden>
                        {index + 1}
                      </span>
                      <div className={styles.stepBody}>
                        <p className={styles.stepTitle}>{step.title}</p>
                        <p className={styles.stepDesc}>{step.body}</p>
                      </div>
                    </div>
                    {index < CASHBACK_STEPS.length - 1 ? (
                      <div className={styles.stepConnector} aria-hidden>
                        <span className={styles.stepConnectorLine} />
                      </div>
                    ) : null}
                  </div>
                ))}
              </div>
            </section>

            <section className={styles.ctaSection} aria-labelledby="earn-ready">
              <h2 id="earn-ready" className={styles.ctaTitle}>
                Ready to earn EXD?
              </h2>
              <p className={styles.ctaText}>
                Head to your trading account on our platforms and start earning EXD today.
                <br />
                <button type="button" className={styles.termsLink}>
                  Terms &amp; Conditions apply.
                </button>
              </p>
              <button type="button" className={styles.ctaBtn}>
                Trade now
              </button>
            </section>
          </div>
        </div>
      </div>
    </div>
  )

  return deviceFrameEl ? createPortal(overlay, deviceFrameEl) : overlay
}
