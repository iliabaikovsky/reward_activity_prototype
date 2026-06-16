/**
 * Temporary copy for UT self-test overlay (?ut=1).
 * Source of truth: docs/research/USABILITY_TEST_QUESTIONS.md (editable)
 * Remove panel + this file after UserTesting pilot.
 */
export type UsabilityTestChapter = {
  id: string
  title: string
  scenario: string
  tasks: string[]
  probes?: string[]
}

export const USABILITY_TEST_CHAPTERS: UsabilityTestChapter[] = [
  {
    id: 'empty',
    title: 'Chapter 1 — First visit',
    scenario:
      'You opened the Exness app and navigated to Exness Rewards for the first time. You have not earned any rewards yet.',
    tasks: [
      'Look around. What do you see? What is this area for?',
      'In your own words, how do you understand the different sections on this page?',
      'Required: tap ⓘ top-right. Scroll promo. What was that page about? How would you end up getting real money?',
      'Close promo. Where would you expect rewards not yet received vs ready to use?',
      'Anything confusing or missing on this empty screen?',
    ],
  },
  {
    id: 'upcoming_loyalty',
    title: 'Chapter 2 — After trading this week',
    scenario:
      'A few days passed. You traded over the past few days. Open the link — this is what Rewards looks like now.',
    tasks: [
      'What changed compared to before? What is new on the screen?',
      'Find Upcoming. What do these items mean? When will you get the money?',
      'Tap into Upcoming. Open one reward row. What details do you see? What does the reward list mean?',
      'Go deeper: Upcoming → Loyalty rewards → Rewards — tap a row, describe inside.',
      'Back to main screen. Why is nothing in the Activity feed?',
    ],
  },
  {
    id: 'activation_1',
    title: 'Chapter 3 — Week closed, reward activated',
    scenario: 'The week ended (your loyalty reward should have activated). Open the link.',
    tasks: [
      'What changed since you last looked? What happened to Upcoming?',
      'Check Available rewards and Activity feed (preview or See all). How do these relate to Upcoming before?',
      'Open one Activity feed item (loyalty). How does it compare to what you saw in Upcoming earlier?',
      'In one sentence: difference between Upcoming and Activity feed?',
    ],
  },
  {
    id: 'transfer',
    title: 'Chapter 4 — Transfer to trading account',
    scenario: 'You transferred EXD from Available rewards to your trading account. Open the link.',
    tasks: [
      'What changed on the wallets / balances?',
      'What changed in the Activity feed?',
      'Where would you look to see EXD on your trading account vs ready to transfer?',
    ],
  },
  {
    id: 'trade_exd_rebate',
    title: 'Chapter 5 — Traded again using EXD',
    scenario: 'You traded again on the account that has EXD. Open the link.',
    tasks: [
      'What is new in Upcoming? Explain in your own words.',
      'Open EXD cashback in Upcoming. What do you see? Explain how you understand it.',
      'Open EXD cashback inside Upcoming (Total upcoming). How do you understand the details?',
      'Upcoming → EXD cashback → Cashback section: tap one row. Explain how you understand it.',
      'Trading account balance — does anything explain why EXD went down?',
    ],
  },
  {
    id: 'cashback_settled',
    title: 'Chapter 6 — Next day, cashback credited',
    scenario: 'One day passed. Open the link.',
    tasks: [
      'What changed on the page?',
      'Find credited cashback. Open it. What details explain the amount?',
      'Full path: earn EXD → transfer → trade with EXD → pending → this screen. What was unclear?',
      'What does the Lifetime cashback section show?',
    ],
  },
  {
    id: 'mature_trader_tuesday',
    title: 'Chapter 7 — Multi-account (~one month later)',
    scenario:
      'About a month later. You trade from several accounts in different currencies. Open the link.',
    tasks: [
      'Look at Upcoming and Activity feed. How many cashback items? Why more than one?',
    ],
  },
]

export const USABILITY_TEST_INTRO =
  'You are testing an early mobile prototype of Exness Rewards. Balances are sample data. Think aloud — there are no wrong answers. Tap anything that looks tappable.'
