# Transaction details: сверка Exness Rewards × fintech benchmark

Сопоставление Kind ID прототипа с паттернами из [`FINTECH_TRANSACTION_DETAIL_UX.md`](FINTECH_TRANSACTION_DETAIL_UX.md) (Mobbin, iOS fintech). **Без правок кода** — только рекомендации для ревью copy/UX.

Источник продукта: [`TRANSACTIONS_CATALOG.md`](../product/TRANSACTIONS_CATALOG.md) §2–§5.

---

## 1. Mapping matrix

| Kind ID | Наш modal (сейчас) | Ближайший fintech ref | Pattern IDs | Align / Gap |
|---------|-------------------|----------------------|-------------|-------------|
| `loyalty_upcoming` | Pack: hero EXD + chip **Upcoming**; **To** → Available rewards; **Available on**; **For trading on** (week); orders preview | Chase cashback pending ([fee75193](https://mobbin.com/screens/fee75193-7473-4b72-b3a7-e0d4f517b7ac)); Acorns ETA ([c8abf0b9](https://mobbin.com/screens/c8abf0b9-e682-4dd2-90e6-43bce99077c1)); Wise timeline ([d889a123](https://mobbin.com/screens/d889a123-a33f-4f6a-b1f8-b302d3d548a9)) | H3, P1, P2, N1 | **Align:** To/When/Why order. **Gap:** нет progress/ETA кроме даты в поле |
| `loyalty_activated` | Pack: chip **Activated**; To; **Available on** (datetime); For trading on; orders | Chase purchase settled; Revolut Completed ([2d2e3b4d](https://mobbin.com/screens/2d2e3b4d-ac79-444a-a0a8-25730f8e3e0c)) | H3, S1, N1 | **Align:** success chip + When. **Gap:** нет linked «activity» parent (не нужен если пачка = aggregate) |
| `cashback_upcoming` | Pack: chip **Upcoming**; **Credits on**; **For trading on**; orders EXD→Cashback | Wise «should arrive by»; Acorns Estimated; Wealthsimple Authorized + future earn ([2808c9d5](https://mobbin.com/screens/2808c9d5-2457-40e1-8a07-142090cded79)) | H3, P1, B1, N1 | **Align:** future credit date label. **Gap:** list says «For trading with EXD» — modal adds day (OK per catalog) |
| `cashback_credited` | Pack **static only**; chip **Credited**; Credited on, For trading on, Account; orders | Coinbase Completed + fee lines ([c17e1736](https://mobbin.com/screens/c17e1736-36d9-47f6-b99b-5ca3b40bb76f)); Chase reward settled | H3, B1, S1 | **Gap P0:** list row ≠ modal (Jan demo); no `buildCashbackPackFromFeedItem` |
| `transfer_exd` | Simple: chip **Completed**; **Completed on**; From; To account | Revolut top-up ([2d2e3b4d](https://mobbin.com/screens/2d2e3b4d-ac79-444a-a0a8-25730f8e3e0c)); Wise received ([aa868a5e](https://mobbin.com/screens/aa868a5e-3505-4b44-aa86-b9fb9f60a2e7)) | H1, S3 | **Align:** When → From → To. **Gap P1:** hero amount static ≠ list (если ещё не sync из feed) |
| `promo_gift` | Simple: **Credited**; To; **Credited on**; **Comment** | Wealthsimple reward deposit flows; Monzo incoming ([0022dc77](https://mobbin.com/screens/0022dc77-b166-4cd3-ad05-7e85b26ad767)) | H3, S3 | **Align:** gift = Credited + To wallet + message as Why |
| `exd_adjustment` | Simple: **Adjusted** chip (negative tone); From; To account; **Processed on**; **Reason** | Negative list tone; Revolut outflows (neutral hero) | H3, S3 | **Align:** chip carries negative state; hero amount neutral (как Revolut не красит весь hero) |

---

## 2. Alignments (оставляем)

1. **Порядок полей When → From → To → Why** (пропуск слота, если поля нет) — принято в продукте; см. catalog §0.
2. **Product-specific chips** (Upcoming / Activated / Credited / Transferred / Adjusted) — лучше generic «Completed» для reward domain (Coinbase Completed — для payment, не loyalty).
3. **Pack + orders + order detail** — аналог Revolut trade history ([6c1ea3b9](https://mobbin.com/screens/6c1ea3b9-4e4b-47ef-b08d-a87ac9377b47)) и Coinbase leg breakdown.
4. **For trading on** как Why (период пн–вс / день) — нет прямого 1:1, но ближе к «earning period» чем merchant category.
5. **UTC в datetime fields** — на уровне Coinbase/Revolut полной даты; Exness явно маркирует UTC в catalog.
6. **List vs modal copy split** (`lines[]` разговорные vs `details[].label` поля) — стандарт fintech (Monzo list subtitle vs detail rows).

---

## 3. Gaps (приоритеты)

### P0 — ломает доверие / ревью

| ID | Проблема | Evidence | Рекомендация |
|----|----------|----------|--------------|
| G-P0-1 | `cashback_credited`: feed Mar 24 → modal Jan static | TRANSACTIONS_CATALOG §4.4, §2 `mock-only` | Добавить `buildCashbackPackFromFeedItem` (зеркало loyalty); hero amount + Credited on + period из row |
| G-P0-2 | `transfer_exd`: list amount ≠ modal hero | §4.5 static demo | Override из feed item или синхронизировать static с G_MAR mock |

### P1 — UX parity с fintech

| ID | Проблема | Fintech ref | Рекомендация |
|----|----------|-------------|--------------|
| G-P1-1 | Upcoming без **ETA narrative** (только дата в поле) | Acorns progress + «Estimated Feb 13»; Wise steps | Под chip или под When: одна строка «Estimated credit Wed, Mar 25»; опционально thin progress (prototype) |
| G-P1-2 | Cashback/loyalty reward не показывает **parent context** | Chase ACTIVITY row | Опциональная секция «Earning activity» (1 row: trade day / account) без полного receipt |
| G-P1-3 | Order detail: нет явного **fee/rate breakdown** в hero | Revolut Fees + Traded value; Coinbase Network fee | В order detail cashback: визуально отделить EXD debited / USD leg / Rate (уже в labels — проверить иерархию bold) |
| G-P1-4 | Нет secondary actions | Revolut Download; Monzo Get help | Out of scope прототипа — зафиксировать в API spec, не в UI CE-3142 |
| G-P1-5 | Transfer chip copy drift | Catalog §4.5 «Completed» vs §0 «Transferred» | Единый chip **Transferred** + audit `simpleConfigs` |

### P2 — polish

| ID | Проблема | Рекомендация |
|----|----------|--------------|
| G-P2-1 | Плоский `DetailFieldList` без секций | Для pack с 3+ полями — optional labels **DETAILS** (caps) как Chase |
| G-P2-2 | Wealthsimple-style «You'll earn…» на list | Для upcoming USD: optional subtitle «Credits to trading account» если продукт согласует |
| G-P2-3 | Dual currency в hero | Revolut Rewards +ENA/+$ — для EXD+USD не смешивать в одной строке hero (уже раздельные Kind) |

---

## 4. Recommendations по Kind (actionable)

### `loyalty_upcoming`

- **Copy:** оставить **Available on** (не «Credits on») — loyalty идёт в EXD wallet; согласовано с catalog.
- **UX:** P1 — добавить subline под chip: `Estimated credit · Wed, Mar 25` (парсинг из `row.date`).
- **Orders:** сохранить preview 3 + View all; соответствует N1.

### `loyalty_activated`

- **Copy:** **Activated** chip OK (не «Completed»).
- **When:** сохранить UTC в **Available on** / feed time.
- **UX:** не требовать map/merchant (не grocery app).

### `cashback_upcoming`

- **Copy:** list **For trading with EXD** / modal **For trading on** {day} — OK (TRANSACTION_SUMMARY).
- **UX:** mirror G-P1-1 для **Credits on** date.

### `cashback_credited`

- **P0:** dynamic pack override по `feedItemId` (как loyalty).
- **Copy:** nav **EXD cashback** (не «Cashback») — уже в catalog; modal `navTitle` проверить в `packConfigs`.
- **UX:** рассмотреть секцию ACTIVITY: «From trading with EXD» one-liner.

### `transfer_exd`

- **P0/P1:** sync amounts.
- **Copy:** **Completed on** (UTC); chip **Completed**.

### `promo_gift` / `exd_adjustment`

- Simple modal достаточен; **без orders** — align с Monzo simple incoming / adjustment flows.
- **exd_adjustment:** не красить hero amount — **keep** (Revolut pattern).

---

## 5. Out of scope (явно)

| Item | Reason |
|------|--------|
| Revolut dark theme | Exness light modal |
| Chase map on purchase | Нет geo у trade rewards |
| Monzo split bill / receipts | Не B2C trading rewards |
| Coinbase on-chain send list | Crypto transfer ≠ EXD transfer |
| Rakuten approval modal | Affiliate; другой lifecycle |
| Download PDF / Get help buttons | Post-MVP |

---

## 6. Следующие шаги (implementation — отдельная задача)

1. P0: `buildCashbackPackFromFeedItem` + wire `App.tsx` `packOverride` для `cashback-activated`.
2. P0: transfer simple config amounts из feed.
3. P1: optional ETA subline component в `DetailHero` или под `DetailFieldList`.
4. Заполнить **Review: UX** в TRANSACTIONS_CATALOG §2 со ссылкой `GAP §3 G-P0-*`.

---

## 7. Ссылки

| Документ | Назначение |
|----------|------------|
| [FINTECH_TRANSACTION_DETAIL_UX.md](FINTECH_TRANSACTION_DETAIL_UX.md) | Mobbin benchmark, pattern IDs |
| [TRANSACTIONS_CATALOG.md](../product/TRANSACTIONS_CATALOG.md) | Kind matrices, data source |
| [TRANSACTION_SUMMARY_DISPLAY_RULES.md](../product/TRANSACTION_SUMMARY_DISPLAY_RULES.md) | Upcoming drill copy |
