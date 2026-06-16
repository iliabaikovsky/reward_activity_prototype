# Usability test — UserTesting paste guide

**Language:** English · **Host:** `https://reward-activity.vercel.app`  
**Chapters:** 7 · `?ut=1&step=1` … `step=7` (fixed lifecycle, no dev rail)

**Full study design:** [`USABILITY_TEST_LIFECYCLE.md`](USABILITY_TEST_LIFECYCLE.md)

---

## How to build in UserTesting

Use this order for each chapter (after study **Instructions**):


| UT block            | What to paste                                              |
| ------------------- | ---------------------------------------------------------- |
| **Navigation task** | Start URL + short **Taskbar** + **Description** (scenario) |
| **Verbal response** | Questions below — **copy verbatim**, do not rephrase       |


**Tips (UserTesting):**

- **Taskbar** — max ~3 lines; reminder only (“open link, explore, think aloud”).
- **Description page** — context + scenario (≤500 chars if possible).
- **Verbal response** — numbered list OK in one block; remind: *think aloud*.
- Preview + **1 pilot** before full launch.

---

## Study Instructions (add once — block 1)

Paste into **Instructions**:

> You are testing an early **mobile prototype** of **Exness Rewards** (loyalty in the Exness trading app). Data is **sample only** — not real trading.
>
> You are an **experienced trader**. 
>
> **Think aloud** the whole time. No wrong answers. Tap anything that looks tappable. Say if something looks broken.

---

## Chapter 1 — First visit

**Lifecycle:** `empty`

### Navigation task


| Field           | Paste                                                                                                                                                                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Start URL**   | `https://reward-activity.vercel.app/?ut=1&step=1`                                                                                                                                                                                         |
| **Taskbar**     | Open the link. If the browser asks for a login: **user** / **password**. First visit to Exness Rewards — explore and **think aloud**.                                                                                                     |
| **Description** | Before the prototype loads, your browser may ask for a login — **Username:** `user`, **Password:** `password`. You opened the Exness app and navigated to **Exness Rewards** for the first time. You have **not** earned any rewards yet. |


### Verbal response

1. Look around the screen. **What do you see?** What do you think this area is for?
2. In your own words, **how do you understand the different sections** on this page?
3. **Required:** Tap the **information icon (ⓘ)** in the **top-right** of the header. Scroll through the promo page. In your own words: **What was that page about? How would you end up getting real money?**
4. Close the promo and return to the main Rewards screen. Where would you expect to see **rewards you have not received yet**? Where **rewards you can use now**?
5. Is anything confusing or missing on this empty screen?

---

## Chapter 2 — After trading this week

**Lifecycle:** `upcoming_loyalty`

### Navigation task


| Field           | Paste                                                                                              |
| --------------- | -------------------------------------------------------------------------------------------------- |
| **Start URL**   | `https://reward-activity.vercel.app/?ut=1&step=2`                                                  |
| **Taskbar**     | Open the link. A few days passed since Chapter 1. Explore and **think aloud**.                     |
| **Description** | A few days passed. You **traded** over the past few days. This is what Rewards looks like **now**. |


### Verbal response

1. **What changed** compared to before? What is new on the screen?
2. Find **Upcoming**. **What do you think these items mean?** When will you get the money?
3. Tap into **Upcoming** if you can. Open **one reward row** and look inside. **What details do you see?** What does the reward list mean?
4. If you can, go **one level deeper**: **Upcoming → Loyalty rewards → Rewards** — tap a row and describe what you see inside.
5. Go back to the main Rewards screen. **Why is nothing in the Activity feed?**

---

## Chapter 3 — Week closed, reward activated

**Lifecycle:** `activation_1`

### Navigation task


| Field           | Paste                                                           |
| --------------- | --------------------------------------------------------------- |
| **Start URL**   | `https://reward-activity.vercel.app/?ut=1&step=3`               |
| **Taskbar**     | Open the link. The week ended. Explore and **think aloud**.     |
| **Description** | The **week ended** (your loyalty reward should have activated). |


### Verbal response

1. **What changed** since you last looked? What happened to **Upcoming**?
2. Check **Available rewards** and **Activity feed** (preview or **See all**). How do these relate to what you saw in Upcoming before?
3. Open **one Activity feed item** (loyalty). **How does it compare** to what you saw in Upcoming earlier?
4. In one sentence: explain the difference between **Upcoming** and **Activity feed**.

---

## Chapter 4 — Transfer to trading account

**Lifecycle:** `transfer`

### Navigation task


| Field           | Paste                                                                                    |
| --------------- | ---------------------------------------------------------------------------------------- |
| **Start URL**   | `https://reward-activity.vercel.app/?ut=1&step=4`                                        |
| **Taskbar**     | Open the link. You transferred EXD to your trading account. Explore and **think aloud**. |
| **Description** | You **transferred** EXD from Available rewards to your **trading account**.              |


### Verbal response

1. **What changed** on the wallets / balances?
2. **What changed** in the Activity feed?
3. Where would you look to see EXD **on your trading account** vs **ready to transfer**?

---

## Chapter 5 — Traded again using EXD

**Lifecycle:** `trade_exd_rebate`

### Navigation task


| Field           | Paste                                                                                |
| --------------- | ------------------------------------------------------------------------------------ |
| **Start URL**   | `https://reward-activity.vercel.app/?ut=1&step=5`                                    |
| **Taskbar**     | Open the link. You traded again on an account with EXD. Explore and **think aloud**. |
| **Description** | You **traded again** on the account that has **EXD**.                                |


### Verbal response

1. **What is new in Upcoming?** Explain it in your own words.
2. Open **EXD cashback** in Upcoming. **What do you see?** Explain how you understand it.
3. Open **EXD cashback** inside Upcoming where you see **Total upcoming**. **How do you understand the details?**
4. Open **EXD cashback** again: **Upcoming → EXD cashback** → in the **Cashback** section, **tap one row**. Explain how you understand it.
5. Check your **trading account** balance — does anything explain why EXD went down?

---

## Chapter 6 — Next day, cashback credited

**Lifecycle:** `cashback_settled`

### Navigation task


| Field           | Paste                                                       |
| --------------- | ----------------------------------------------------------- |
| **Start URL**   | `https://reward-activity.vercel.app/?ut=1&step=6`           |
| **Taskbar**     | Open the link. One day passed. Explore and **think aloud**. |
| **Description** | **One day passed.**                                         |


### Verbal response

1. **What changed** on the page?
2. Find the **credited cashback**. Open it. **What details explain the amount?**
3. Looking back at the full path — **earn EXD → transfer → trade with EXD → pending → this screen** — what was unclear?
4. **What does the Lifetime cashback section show?**

---

## Chapter 7 — Multi-account (~one month later)

**Lifecycle:** `mature_trader_tuesday`

### Navigation task


| Field           | Paste                                                                                     |
| --------------- | ----------------------------------------------------------------------------------------- |
| **Start URL**   | `https://reward-activity.vercel.app/?ut=1&step=7`                                         |
| **Taskbar**     | Open the link. About a month later, several accounts. Explore and **think aloud**.        |
| **Description** | About **a month later**. You trade from **several accounts** in **different currencies**. |


### Verbal response

1. Look at **Upcoming** and **Activity feed**. **How many cashback items** do you see? **Why more than one?**

---

## Post-study (after Chapter 7)

Add as **Rating** (1–5) + **Verbal response** blocks, or one **Verbal response**:

**Ratings (1–5):**

1. How easy was it to understand **Upcoming rewards**?
2. How easy was it to understand **cashback vs loyalty rewards**?

**Verbal:**

1. What was the **most confusing** moment?
2. If a friend asked “what is Exness Rewards?”, what would you say in **two sentences**?

---

## Full task list (study builder checklist)


| #     | UT type         | Label                       |
| ----- | --------------- | --------------------------- |
| 1     | Instructions    | Study intro                 |
| 2     | Navigation      | Chapter 1                   |
| 3     | Verbal response | Chapter 1 questions         |
| 4     | Navigation      | Chapter 2                   |
| 5     | Verbal response | Chapter 2 questions         |
| 6     | Navigation      | Chapter 3                   |
| 7     | Verbal response | Chapter 3 questions         |
| 8     | Navigation      | Chapter 4                   |
| 9     | Verbal response | Chapter 4 questions         |
| 10    | Navigation      | Chapter 5                   |
| 11    | Verbal response | Chapter 5 questions         |
| 12    | Navigation      | Chapter 6                   |
| 13    | Verbal response | Chapter 6 questions         |
| 14    | Navigation      | Chapter 7                   |
| 15    | Verbal response | Chapter 7 questions         |
| 16–17 | Rating          | Post-study (optional split) |
| 18    | Verbal response | Post-study open             |


**Estimated length:** ~25–35 min (pilot to confirm).