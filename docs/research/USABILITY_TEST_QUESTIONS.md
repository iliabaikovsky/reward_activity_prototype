# Usability test — participant questions (editable)

**Language:** English (for UserTesting.com)  
**Chapters:** 7 — matches lifecycle `?ut=1&step=1` … `step=7`

Edit this file in a separate window. When done, send it back — we sync into `src/rewardLifecycle/usabilityTestChapters.ts` and the on-screen `UsabilityTestPanel`.

**Full study design:** [`USABILITY_TEST_LIFECYCLE.md`](USABILITY_TEST_LIFECYCLE.md)

**Prototype links (replace `<host>`):**

| Chapter | URL |
|---------|-----|
| 1 | `https://<host>/?ut=1&step=1` |
| 2 | `https://<host>/?ut=1&step=2` |
| 3 | `https://<host>/?ut=1&step=3` |
| 4 | `https://<host>/?ut=1&step=4` |
| 5 | `https://<host>/?ut=1&step=5` |
| 6 | `https://<host>/?ut=1&step=6` |
| 7 | `https://<host>/?ut=1&step=7` |

---

## Intro (once, before Chapter 1)

**Context**

You are testing an early **mobile prototype** of **Exness Rewards** — a loyalty area inside the Exness trading app. This is not live trading; balances and transactions are **sample data** for design research only.

You are an **experienced trader** (you know orders, accounts, and P/L). You may **not** know how Exness Dollars (EXD) or reward cashback work yet — that is what we are studying.

**Rules**

- Think aloud: say what you are looking at and what you expect.
- There are no wrong answers.
- Tap anything that looks tappable.
- If something looks broken, say so — it may be a prototype limitation.

**Short intro (overlay / optional)**

You are testing an early mobile prototype of Exness Rewards. Balances are sample data. Think aloud — there are no wrong answers. Tap anything that looks tappable.

---

## Chapter 1 — First visit

**Lifecycle id:** `empty` · **Link:** `?ut=1&step=1`

### Scenario

You opened the Exness app and navigated to **Exness Rewards** for the first time. You have **not** earned any rewards yet.

### Tasks & questions

1. Look around the screen. **What do you see?** What do you think this area is for?
2. In your own words, **how do you understand the different sections** on this page?
3. **Required:** Tap the **information icon (ⓘ)** in the **top-right** of the header. Scroll through the promo page. In your own words: **What was that page about? How would you end up getting real money?**
4. Close the promo and return to the main Rewards screen. Where would you expect to see **rewards you have not received yet**? Where **rewards you can use now**?
5. Is anything confusing or missing on this empty screen?

---

## Chapter 2 — After trading this week

**Lifecycle id:** `upcoming_loyalty` · **Link:** `?ut=1&step=2`

### Scenario

A few days passed. You **traded** over the past few days. Open the link — this is what Rewards looks like **now**.

### Tasks & questions

1. **What changed** compared to before? What is new on the screen?
2. Find **Upcoming**. **What do you think these items mean?** When will you get the money?
3. Tap into **Upcoming** if you can. Open **one reward row** and look inside. **What details do you see?** What does the reward list mean?
4. If you can, go **one level deeper**: **Upcoming → Loyalty rewards → Rewards** — tap a row and describe what you see inside.
5. Go back to the main Rewards screen. **Why is nothing in the Activity feed?**

---

## Chapter 3 — Week closed, reward activated

**Lifecycle id:** `activation_1` · **Link:** `?ut=1&step=3`

### Scenario

The **week ended** (your loyalty reward should have activated). Open the link.

### Tasks & questions

1. **What changed** since you last looked? What happened to **Upcoming**?
2. Check **Available rewards** and **Activity feed** (preview or **See all**). How do these relate to what you saw in Upcoming before?
3. Open **one Activity feed item** (loyalty). **How does it compare** to what you saw in Upcoming earlier?
4. In one sentence: explain the difference between **Upcoming** and **Activity feed**.

---

## Chapter 4 — Transfer to trading account

**Lifecycle id:** `transfer` · **Link:** `?ut=1&step=4`

### Scenario

You **transferred** EXD from Available rewards to your **trading account**. Open the link.

### Tasks & questions

1. **What changed** on the wallets / balances?
2. **What changed** in the Activity feed?
3. Where would you look to see EXD **on your trading account** vs **ready to transfer**?

---

## Chapter 5 — Traded again using EXD

**Lifecycle id:** `trade_exd_rebate` · **Link:** `?ut=1&step=5`

### Scenario

You **traded again** on the account that has **EXD**. Open the link.

### Tasks & questions

1. **What is new in Upcoming?** Explain it in your own words.
2. Open **EXD cashback** in Upcoming. **What do you see?** Explain how you understand it.
3. Open **EXD cashback** inside Upcoming where you see **Total upcoming**. **How do you understand the details?**
4. Open **EXD cashback** again: **Upcoming → EXD cashback** → in the **Cashback** section, **tap one row**. Explain how you understand it.
5. Check your **trading account** balance — does anything explain why EXD went down?

---

## Chapter 6 — Next day, cashback credited

**Lifecycle id:** `cashback_settled` · **Link:** `?ut=1&step=6`

### Scenario

**One day passed.** Open the link.

### Tasks & questions

1. **What changed** on the page?
2. Find the **credited cashback**. Open it. **What details explain the amount?**
3. Looking back at the full path — **earn EXD → transfer → trade with EXD → pending → this screen** — what was unclear?
4. **What does the Lifetime cashback section show?**

---

## Chapter 7 — Multi-account (~one month later)

**Lifecycle id:** `mature_trader_tuesday` · **Link:** `?ut=1&step=7`

### Scenario

About **a month later**. You trade from **several accounts** in **different currencies**. Open the link.

### Tasks & questions

1. Look at **Upcoming** and **Activity feed**. **How many cashback items** do you see? **Why more than one?**

---

## Post-study survey (after Chapter 7)

1. How easy was it to understand **Upcoming rewards**? (1–5)
2. How easy was it to understand **cashback vs loyalty rewards**? (1–5)
3. What was the **most confusing** moment?
4. If a friend asked “what is Exness Rewards?”, what would you say in **two sentences**?
