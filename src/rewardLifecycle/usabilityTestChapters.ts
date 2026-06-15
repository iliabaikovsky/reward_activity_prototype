/**
 * Temporary copy for UT self-test overlay (?ut=1).
 * Source of truth for participant script: docs/research/USABILITY_TEST_LIFECYCLE.md
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
      'Required: tap the information icon (ⓘ) top-right. Scroll the promo page. In your own words: what is EXD? How do rewards relate to trading?',
      'Close promo. Where would you expect pending vs available rewards?',
      'Anything confusing on this empty screen?',
    ],
  },
  {
    id: 'upcoming_loyalty',
    title: 'Chapter 2 — After trading this week',
    scenario:
      'A few days passed. You traded this week. This is what Rewards looks like now.',
    tasks: [
      'What changed compared to before? What is new?',
      'Find Upcoming. What do these items mean? When will you get the money?',
      'Tap into Upcoming. Open one reward row. What details do you see? What do the orders mean?',
      'Why is Activity / history still empty (if you notice)?',
    ],
    probes: ['Tap the loyalty row. What does “For trading on …” mean to you?'],
  },
  {
    id: 'activation_1',
    title: 'Chapter 3 — Week closed, reward activated',
    scenario: 'The week ended. Your loyalty reward was activated.',
    tasks: [
      'What changed since you last looked? What happened to Upcoming?',
      'Check Available rewards and Activity (preview or See all). How do these relate to Upcoming before?',
      'Open one Activity item (loyalty). Same reward as Upcoming earlier, or a different stage?',
      'In one sentence: difference between Upcoming and Activity?',
    ],
  },
  {
    id: 'transfer',
    title: 'Chapter 4 — Transfer to trading account',
    scenario: 'You transferred EXD from Available rewards to your trading account.',
    tasks: [
      'What changed on the wallets / balances?',
      'Find the transfer in Activity. Does the story match what you did?',
      'Where do you see EXD on your trading account vs ready to transfer?',
    ],
  },
  {
    id: 'trade_exd_rebate',
    title: 'Chapter 5 — Traded again using EXD',
    scenario: 'You traded again and used EXD on the trade (rebate / spend).',
    tasks: [
      'What is new in Upcoming? Explain each reward type in your own words.',
      'Open the cashback / dollar Upcoming item. What is this cashback? What does the date mean?',
      'Open the loyalty / crown item if still there. How is it different from cashback?',
      'Check your trading account balance — anything explain why EXD went down?',
    ],
    probes: ['If you spent EXD on a trade, what do you expect to get back?'],
  },
  {
    id: 'cashback_settled',
    title: 'Chapter 6 — Next day, cashback credited',
    scenario: 'One day passed. Cashback from your EXD trade has settled.',
    tasks: [
      'What changed in Upcoming vs Activity vs Lifetime cashback (if shown)?',
      'Find credited cashback in Activity. Open it. What explains the amount?',
      'Trace: trade with EXD → pending → this screen. What was unclear?',
      'If you wanted all cashback ever, where would you look?',
    ],
  },
  {
    id: 'mature_trader_tuesday',
    title: 'Chapter 7 — Multi-account (~one month later)',
    scenario: 'About a month later. You trade from several accounts in different currencies.',
    tasks: [
      'Look at Upcoming. How many cashback items? Why more than one?',
      'On the main screen: cashback one total or several? Does that match expectations?',
      'Drill into one foreign-currency cashback (THB, JPY, INR). Which account is it for?',
      'Open Activity feed → browse Cashback if you can. How does history compare to Upcoming?',
      'How confident managing rewards across multiple accounts? (1–5, explain)',
    ],
  },
]

export const USABILITY_TEST_INTRO =
  'You are testing an early mobile prototype of Exness Rewards. Balances are sample data. Think aloud — there are no wrong answers. Tap anything that looks tappable.'
