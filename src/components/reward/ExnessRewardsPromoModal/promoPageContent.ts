import tierGold from '../../../assets/promo-page/tier-gold.png'
import tierPlatinum from '../../../assets/promo-page/tier-platinum.png'
import tierDiamond from '../../../assets/promo-page/tier-diamond.png'
import tierElite from '../../../assets/promo-page/tier-elite.png'
import tierUltra from '../../../assets/promo-page/tier-ultra.png'
import tierUltimate from '../../../assets/promo-page/tier-ultimate.png'
import benefitExdCashback from '../../../assets/promo-page/benefits/exd-cashback.png'
import benefitExclusiveExperience from '../../../assets/promo-page/benefits/exclusive-experience.png'
import benefitPrioritySupport from '../../../assets/promo-page/benefits/priority-support.png'
import benefitExdBooster from '../../../assets/promo-page/benefits/exd-booster.png'
import benefitAccountManager from '../../../assets/promo-page/benefits/account-manager.png'
import benefitTradingStrategist from '../../../assets/promo-page/benefits/trading-strategist.png'
import benefitBirthdayGifts from '../../../assets/promo-page/benefits/birthday-gifts.png'
import benefitTierFreeze from '../../../assets/promo-page/benefits/tier-freeze.png'
import benefitMarketInsights from '../../../assets/promo-page/benefits/market-insights.png'

export type PromoStep = {
  title: string
  body: string
  linkLabel?: string
}

export type PromoTierBenefit = {
  label: string
  included: boolean
}

export type PromoTier = {
  name: string
  image: string
  benefits: PromoTierBenefit[]
}

export type PromoBenefitSlide = {
  title: string
  body: string
  image: string
}

const BENEFIT_LABELS = [
  'EXD & cashback',
  'EXD Booster',
  'Market insights',
  'Priority support',
  'Dedicated Account Manager',
  'Birthday gifts',
  '30-day Tier Freeze',
  'Exclusive experience & gifts',
  'Trading Strategist 1-on-1',
] as const

function benefitsUpTo(includedCount: number): PromoTierBenefit[] {
  return BENEFIT_LABELS.map((label, index) => ({
    label,
    included: index < includedCount,
  }))
}

export const PROMO_HOW_IT_WORKS: PromoStep[] = [
  {
    title: 'Trade and earn EXD',
    body: 'Earn Exness Dollars (EXD) when you trade and turn them into withdrawable cashback. 1 EXD = 1 USD.',
    linkLabel: 'Learn more',
  },
  {
    title: 'Level up your status',
    body: 'As you earn EXD, your status will increase, giving you access to even better benefits.',
  },
  {
    title: 'Unlock bigger benefits',
    body: 'As you level up, you’ll unlock rewards like boosted EXD rates, priority support and much more.',
  },
]

/** Gold → Ultimate; perks unlock left-to-right per Figma `43728:23993`. */
export const PROMO_TIERS: PromoTier[] = [
  { name: 'Gold', image: tierGold, benefits: benefitsUpTo(1) },
  { name: 'Platinum', image: tierPlatinum, benefits: benefitsUpTo(3) },
  { name: 'Diamond', image: tierDiamond, benefits: benefitsUpTo(4) },
  { name: 'Elite', image: tierElite, benefits: benefitsUpTo(6) },
  { name: 'Ultra', image: tierUltra, benefits: benefitsUpTo(7) },
  { name: 'Ultimate', image: tierUltimate, benefits: benefitsUpTo(9) },
]

/** Carousel order per Figma `43728:23994` — What you get with Exness Rewards. */
export const PROMO_BENEFITS: PromoBenefitSlide[] = [
  {
    title: 'EXD & cashback',
    body: 'Earn EXD from your trading activity and turn it into withdrawable cash at any trading stage. 1 EXD = 1 USD.',
    image: benefitExdCashback,
  },
  {
    title: 'Exclusive experience & gifts',
    body: 'Enjoy and celebrate with carefully selected gifts from Exness on special occasions. From broker vouchers to the thrill of winning, we celebrate your loyalty in meaningful ways.',
    image: benefitExclusiveExperience,
  },
  {
    title: 'Priority support',
    body: 'Receive fast-track support. All your requests will be given priority by our customer support team members.',
    image: benefitPrioritySupport,
  },
  {
    title: 'EXD Booster',
    body: 'Multiply the EXD you earn from trading and feature bonus rewards. Increase your status level to unlock new benefits and get even more cashback by earning more EXD.',
    image: benefitExdBooster,
  },
  {
    title: 'Dedicated Account Manager',
    body: 'Get the full attention of a dedicated account manager who will personally look after your individual trade opportunities.',
    image: benefitAccountManager,
  },
  {
    title: 'Trading Strategist 1-on-1',
    body: 'Get personalized guidance and refine your trading goals in a one-on-one session with an Exness Trading Strategist.',
    image: benefitTradingStrategist,
  },
  {
    title: 'Birthday gifts',
    body: 'It’s your special day and we’re happy to celebrate it with you. Enjoy a birthday surprise from Exness to make your day even more special.',
    image: benefitBirthdayGifts,
  },
  {
    title: '30-day Tier Freeze',
    body: 'Didn’t earn enough EXD to maintain your status? Tier Freeze gives you 30 extra days to keep your status and benefits. Available once per calendar year.',
    image: benefitTierFreeze,
  },
  {
    title: 'Market Insights',
    body: 'Stay informed with exclusive analysis of traded instruments, helping you identify market trends and volatility. Insights are curated by Exness experts to help with your decisions and market awareness.',
    image: benefitMarketInsights,
  },
]

export const PROMO_EXD_CASHBACK_STEPS: PromoStep[] = [
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
]
