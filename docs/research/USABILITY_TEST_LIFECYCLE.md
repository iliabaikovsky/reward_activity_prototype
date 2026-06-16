# Usability test — Exness Rewards lifecycle (CE-3142)

Сценарий **unmoderated** теста на UserTesting.com: провести опытного трейдера через упрощённый lifecycle наград, собрать понимание **Upcoming**, drill-in, деталей cashback/loyalty и навигации **Rewards ↔ Activity feed**.

**Статус:** ready for UT — `?ut=1&step=1…7`, упрощённый lifecycle, dev rail скрыт, без overlay-панели.

**Редактируемый copy вопросов:** [`USABILITY_TEST_QUESTIONS.md`](USABILITY_TEST_QUESTIONS.md) — paste в UserTesting.

### Связанные документы

| Документ | Зачем |
|----------|--------|
| [`REWARD_LIFECYCLE.md`](../product/REWARD_LIFECYCLE.md) | Текущие 9 шагов симулятора (до упрощения) |
| [`TRANSACTIONS_CATALOG.md`](../product/TRANSACTIONS_CATALOG.md) | Поля list / modal / orders |
| [`DESIGN.md`](../design/DESIGN.md) | Figma node-id |

---

## 0. Цели и research questions

### Продуктовые решения, которые проверяем

| # | Вопрос | Красный флаг |
|---|--------|--------------|
| RQ1 | Понимает ли пользователь **Upcoming** как «ещё не зачислено»? | Путает с Available или считает уже своим |
| RQ2 | **Дойдёт ли** до drill-in Upcoming и bottom sheet без подсказки? | Не тапает в строки / summary |
| RQ3 | Понятна ли **деталка loyalty** (период пн–вс, ордера, badge)? | Не связывает пачку со сделками |
| RQ4 | Понятен ли путь **EXD spent → pending cashback → credited → Lifetime**? | Не видит связь сделки и +5 USD |
| RQ5 | Как **ориентируется** между Rewards home, Upcoming drill, Activity feed? | Не находит «See all» / фильтр Cashback |
| RQ6 | На **multi-account** (THB/JPY/INR): понимает ли разбивку vs агрегат USD? | «Multiple currencies» без модели счетов |
| RQ7 | Помогает ли **promo (ⓘ)** объяснить EXD и cashback? | После ⓘ всё ещё путает EXD и USD cashback |

### Метод

- **Платформа:** UserTesting.com, **unmoderated** (участник один, без модератора).
- **Формат:** think-aloud; **7 глав** = 7 состояний lifecycle; на каждой главе — **новая часть UI**, вопрос «что изменилось».
- **Язык заданий:** English (UI тоже EN).
- **Персона:** active trader (знает trading, ордера, счета); **не** знает Exness Rewards — нужен короткий intro.
- **Длина:** одна сессия, ~**45–55 min** (7 ссылок + intro + promo task).

---

## 1. Упрощение lifecycle (prerequisite, до теста)

Перед записью UT: **commit текущего состояния**, затем упростить симулятор. Тест пишем под **новую** схему.

### Что убираем (от текущих 9 шагов)

| Убрать | Причина |
|--------|---------|
| Шаг `upcoming_loyalty_more` (отдельный) | Слить с первым Upcoming — сразу **несколько ордеров** в одной пачке (badge > 1) |
| `EXD adjustment` | Шум для comprehension; activation без adjustment |
| `Birthday gift` (promo-gift) | Не ядро cashback/loyalty flow |
| Glass rail / ручное переключение для участника | Ломает unmoderated UX |

### Целевая схема — **7 шагов (UT chapters)**

| Ch | id (planned) | Narrative для участника | Что **нового** тестируем |
|----|--------------|-------------------------|---------------------------|
| 1 | `empty` | Первый визит на Rewards | Пустое состояние, tier hero, **promo ⓘ (обязательная задача)** |
| 2 | `upcoming_loyalty` | Поторговали на неделе | **Upcoming** loyalty, drill-in, modal + orders |
| 3 | `activation_1` | Прошла неделя, награда активировалась | **Available**, Activity preview, «что ушло из Upcoming» |
| 4 | `transfer` | Перевели EXD на торговый счёт | **Два кошелька**, transfer в ленте |
| 5 | `trade_exd_rebate` | Снова торговали, потратили EXD | **Pending cashback** + loyalty одновременно |
| 6 | `cashback_settled` | Прошёл день settlement | Cashback **credited**, **Lifetime cashback** |
| 7 | `mature_trader_tuesday` | Торгуете с **разных счетов** ~месяц | Multi-currency Upcoming, агрегат USD на home |

### Activity feed — когда спрашиваем

| Ch | Activity feed |
|----|----------------|
| 1 | Пусто — «Where would past rewards appear?» |
| 2 | Пусто — contrast с Upcoming |
| 3+ | Есть строки — открыть **See all**, сравнить с Upcoming |
| 6–7 | Фильтр **Cashback**, lifetime card → feed |

---

## 2. UserTesting unmoderated — как провести

**Реализовано в прототипе:**

```
https://<host>/?ut=1&step=1   → Chapter 1 (empty)
https://<host>/?ut=1&step=2   → Chapter 2 (upcoming)
…
https://<host>/?ut=1&step=7   → Chapter 7 (mature)
```

Локально: `npm run dev` → `http://localhost:5173/?ut=1&step=1`

| Параметр | Поведение |
|----------|-----------|
| `?ut=1` | Скрыт glass rail; только телефон по центру |
| `?step=N` | N = 1…7, фиксирует lifecycle на загрузке |
| Без `ut` | Обычный dev: glass rail; `?step=N` только задаёт **стартовый** шаг |

### Структура study в UserTesting

1. **Screener:** trades FX/CFDs regularly; uses mobile apps.
2. **Tasks 1–7:** каждая начинается с «Open this link» + scenario framing + questions (§4).
3. **Post-study survey:** 3–5 closed + one open (§5).

**Alternatives (если deep link не успеем)**

| Plan | Минус |
|------|-------|
| 7 отдельных Vercel preview URLs | Долго поддерживать |
| Одна запись, модератор меняет step по Zoom | Не unmoderated — другой метод |
| Figma prototype | Нет реальных drill-in / modal orders |

**Decision:** зафиксировать **deep link + hidden rail** перед пилотом UT.

---

## 3. Pre-test checklist (команда)

- [x] Commit до упрощения lifecycle
- [x] Lifecycle 7 шагов (без adjustment, gift, дубля upcoming)
- [x] `?step=N` + `?ut=1` hide rail (no preview panel)
- [ ] Pilot: 1 internal run ~40 min

---

## 4. Participant script (English)

Copy-paste blocks into UserTesting. **Do not** mention simulator, lifecycle rail, or mock data.

### Intro (once, before Chapter 1)

> **Context**  
> You are testing an early **mobile prototype** of **Exness Rewards** — a loyalty area inside the Exness trading app. This is not live trading; balances and transactions are **sample data** for design research only.
>
> You are an **experienced trader** (you know orders, accounts, and P/L). You may **not** know how Exness Dollars (EXD) or reward cashback work yet — that is what we are studying.
>
> **Rules**  
> - Think aloud: say what you are looking at and what you expect.  
> - There are no wrong answers.  
> - Tap anything that looks tappable.  
> - If something looks broken, say so — it may be a prototype limitation.

---

### Chapter 1 — First visit (link: `?step=1`)

**Scenario**

> You opened the Exness app and navigated to **Exness Rewards** for the first time. You have **not** earned any rewards yet.

**Tasks**

1. Look around the screen. **What do you see?** What do you think this area is for?
2. **Required:** Tap the **information icon (ⓘ)** in the **top-right** of the header. Scroll through the promo page. In your own words: **What is EXD? How do rewards relate to trading?**
3. Close the promo and return to the main Rewards screen. Where would you expect to see **rewards you have not received yet**? Where **rewards you can use now**?
4. Is anything confusing or missing on this empty screen?

**Observe (team)**

- Finds ⓘ without hint (only Ch1 has explicit ⓘ task)
- Mentions Upcoming / Available / wallets unprompted
- Can summarize EXD after promo

---

### Chapter 2 — After trading this week (link: `?step=2`)

**Scenario**

> A few days passed. You **traded** this week. Open the link — this is what Rewards looks like **now**.

**Tasks**

1. **What changed** compared to before? What is new on the screen?
2. Find **Upcoming** (or similar). **What do you think these items mean?** When will you get the money?
3. Tap into **Upcoming** if you can. Open **one reward row** and look inside. **What details do you see?** What do the orders/list mean?
4. Why is nothing in **Activity** / history yet (if you notice an empty feed)?

**Probe (if silent)**

> Tap the loyalty / crown row in Upcoming. What does “For trading on …” mean to you?

**Observe**

- Discovers Upcoming summary vs row tap vs modal
- Understands pending vs available
- Opens order list inside modal

---

### Chapter 3 — Week closed, reward activated (link: `?step=3`)

**Scenario**

> The **week ended**. Your loyalty reward was **activated**. Open the link.

**Tasks**

1. **What changed** since you last looked? What happened to **Upcoming**?
2. Check **Available rewards** and **Activity** (preview or **See all**). How do these relate to what you saw in Upcoming before?
3. Open **one Activity item** (loyalty). Compare to what you saw in Upcoming earlier — **same reward or different stage?**
4. In one sentence: explain the difference between **Upcoming** and **Activity**.

**Observe**

- Activation → Available mental model
- Opens Activity feed
- Connects list row to earlier Upcoming

---

### Chapter 4 — Transfer to trading account (link: `?step=4`)

**Scenario**

> You **transferred** EXD from Available rewards to your **trading account**. Open the link.

**Tasks**

1. **What changed** on the wallets / balances?
2. Find the **transfer** in Activity. Does the story match what you did?
3. Where would you look to see EXD **on your trading account** vs **ready to transfer**?

**Observe**

- Two-wallet comprehension
- Transfer in feed

---

### Chapter 5 — Traded again using EXD (link: `?step=5`)

**Scenario**

> You **traded again** and **used EXD** on the trade (rebate / spend). Open the link.

**Tasks**

1. **What is new in Upcoming?** You may see **more than one** type of reward — explain each in your own words.
2. Open the **cashback / dollar** Upcoming item. **What is this cashback?** What does the date (“Credits on …” / “on …”) mean?
3. Open the **loyalty / crown** item if still present. How is it different from cashback?
4. Check your **trading account** balance — does anything explain why EXD went down?

**Probe**

> If you spent EXD on a trade, what do you expect to get back?

**Observe**

- Separates EXD loyalty vs USD cashback pending
- Opens cashback modal
- Links EXD spend to pending cashback

---

### Chapter 6 — Next day, cashback credited (link: `?step=6`)

**Scenario**

> **One day passed.** Cashback from your EXD trade has **settled**. Open the link.

**Tasks**

1. **What changed** in Upcoming vs Activity vs **Lifetime cashback** (if shown)?
2. Find the **credited cashback** in Activity. Open it. **What details explain the amount?**
3. Trace the story: trade with EXD → pending → **this screen**. What was unclear?
4. If you wanted **all cashback ever**, where would you look?

**Observe**

- Pending cleared from Upcoming
- Lifetime cashback card
- Opens credited cashback modal + orders

---

### Chapter 7 — Multi-account trader (~one month later) (link: `?step=7`)

**Scenario**

> About **a month later**. You trade from **several accounts** in **different currencies**. Open the link.

**Tasks**

1. Look at **Upcoming**. **How many cashback items** do you see? **Why more than one?**
2. On the main Rewards screen, is cashback shown as **one total or several**? Does that match what you expect?
3. Drill into **one foreign-currency cashback** (e.g. THB, JPY, INR). **What account** is it for?
4. Open **Activity feed** → filter or browse **Cashback** if you can. How does history compare to Upcoming?
5. Overall: how confident are you managing rewards across **multiple accounts**? (1–5, explain)

**Observe**

- Multi-row Upcoming vs single USD summary on home (CE-3142 rule)
- Account # in subtitles
- Activity filter Cashback

---

### Promo (ⓘ) — protocol across chapters

| When | Instruction |
|------|-------------|
| **Chapter 1 only** | **Required task** — open ⓘ and summarize EXD (see above) |
| **Chapters 2–7** | **No mandatory ⓘ task** in UT copy |
| **Analysis** | If participant is lost on Ch 5–7, note whether they would benefit from ⓘ (retrofit question in survey) |

**Optional post-study question (English)**

> During the test, did you notice the information (ⓘ) icon again after the first screen? If you opened it later, did it help?

---

## 5. Post-study survey (English)

1. How easy was it to understand **Upcoming rewards**? (1–5)
2. How easy was it to understand **cashback vs EXD loyalty**? (1–5)
3. Did you trust the **amounts and dates** shown? (1–5)
4. What was the **most confusing** moment?
5. If a friend asked “what is Exness Rewards?”, what would you say in **two sentences**?

---

## 6. Facilitator cheat sheet (internal, RU)

Кратко «что на экране» после упрощения — для сверки записей UT.

| Ch | Ключевые элементы |
|----|-------------------|
| 1 | 0 EXD, пустой Upcoming, пустая Activity |
| 2 | Upcoming loyalty **+X EXD**, badge **3+ orders**, Available 0, Activity пустая |
| 3 | Upcoming пустой, Available **+3.20 EXD** (без adjustment → **3.20**), Activity: loyalty activated |
| 4 | Available 0, счёт **#12345678** с EXD, Transfer в ленте |
| 5 | Upcoming: **+5 USD cashback pending** + loyalty; счёт **47.80 EXD** |
| 6 | Cashback в Activity, Lifetime **5 USD**, loyalty ещё в Upcoming |
| 7 | Lifetime **~38 USD**, Upcoming: 1 loyalty + **3 cashback** (THB/JPY/INR), mixed feed |

### Severity при разборе

| Level | Пример |
|-------|--------|
| **Critical** | Не понимает Upcoming = pending; не находит drill-in даже после tap hint |
| **Major** | Путает EXD и USD cashback; не связывает activation с Upcoming |
| **Minor** | Copy/date format; tier hero не относится к задаче |

---

## 7. Что дальше (без кода в этой сессии)

1. Согласовать §1 (7 шагов, цифры после удаления adjustment/gift).
2. Реализовать UT infra: `?step=N`, hide rail.
3. Обновить [`REWARD_LIFECYCLE.md`](../product/REWARD_LIFECYCLE.md) под новую схему.
4. Pilot → правки script → запись N=5 на UserTesting.

---

*Draft v1 — unmoderated UT, simplified 7-chapter lifecycle, English participant copy.*
