# Screenshot catalog — Exness Rewards prototype

Реестр всех PNG для QA, regression и переноса UI в Figma. **Source of truth для автomation:** [`scripts/screenshot-shots.mjs`](../../scripts/screenshot-shots.mjs).

## Как переснять

```bash
npm run dev                    # http://localhost:5173
npm run screenshots:minimal    # ~25 PNG — smoke
npm run screenshots            # ~110 PNG — full catalog
npm run screenshots -- --only modals-pack   # subset by id substring
```

Выход: [`docs/screenshots/`](../screenshots/) — только `.device-frame` (375×812, @2x), без glass rail симулятора.

## Naming

```text
docs/screenshots/{subdir}/{slug}.png
```

| subdir | Содержание |
|--------|------------|
| `rewards/` | Rewards home (top + scroll-секции) |
| `rewards-drill/` | Upcoming drill-in списки |
| `rewards-drill-rows/` | Модалки из строк drill |
| `activity/` | Activity feed + фильтры |
| `modals/` | RewardDetailModal root (7 variants) |
| `modals-feed/` | Модалки из строк полной ленты |
| `modals-pack/` | Drill-down: orders, order detail, ⓘ sheets, closed order |
| `chart/` | OrderChartScreen |

## Sets

| Set | Назначение | ~PNG |
|-----|------------|------|
| `minimal` | PR smoke, быстрая регрессия | 25 |
| `full` | Полный каталог для Figma / design QA | 121 |

При новой фиче: добавить shot в `screenshot-shots.mjs` + строку ниже → `status: implemented`.

---

## 1. Rewards home

### 1.1 Top-of-screen (minimal + full)

По одному кадру на шаг симулятора (scroll = hero):

| id | file | step | kind |
|----|------|------|------|
| rewards/step-01-empty-home | step-01-empty.png | 1 | empty user |
| rewards/step-02-upcoming-loyalty-home | step-02-upcoming-loyalty.png | 2 | pending loyalty |
| rewards/step-03-upcoming-more-home | step-03-upcoming-more.png | 3 | upcoming + badge |
| rewards/step-04-activation-home | step-04-activation.png | 4 | activation + adjustment |
| rewards/step-05-gift-home | step-05-gift.png | 5 | birthday gift |
| rewards/step-06-transfer-home | step-06-transfer.png | 6 | transfer to account |
| rewards/step-07-trade-rebate-home | step-07-trade-rebate.png | 7 | trade + pending cb/loyalty |
| rewards/step-08-cashback-settled-home | step-08-cashback-settled.png | 8 | cashback credited |
| rewards/step-09-mature-trader-home | step-09-mature-trader.png | 9 | ~month trading |

### 1.2 Scroll sections (full only)

Якоря: `data-screenshot` на [`ExnessRewardsScreen.tsx`](../../src/screens/ExnessRewardsScreen.tsx).

На **каждом** шаге: `hero`, `wallets`, `earn-banner`, `lifetime`, `activity-preview`.

Дополнительно `upcoming` на шагах **2, 3, 7, 8, 9** (0-based: 1, 2, 6, 7, 8).

Пример: `rewards/step-07-trade-rebate-wallets.png`, `rewards/step-09-mature-trader-upcoming.png`.

---

## 2. Upcoming drill-in

### 2.1 Aggregate lists (minimal + full)

| id | file | step |
|----|------|------|
| drill/step-02-drill-exd | step-02-drill-exd.png | 2 |
| drill/step-07-drill-usd | step-07-drill-usd.png | 7 |
| drill/step-07-drill-exd | step-07-drill-exd.png | 7 |
| drill/step-09-drill-usd | step-09-drill-usd.png | 9 |
| drill/step-09-drill-exd | step-09-drill-exd.png | 9 |

### 2.2 Row → modal (full)

Якорь строк: `data-upcoming-id`.

| id | upcomingId | step |
|----|------------|------|
| drill-row/02-row-loyalty-upcoming | up-loy-1 | 2 |
| drill-row/03-row-loyalty-badge4 | up-loy-1-more | 3 |
| drill-row/07-row-cashback-upcoming | up-cb-pend | 7 |
| drill-row/07-row-loyalty-upcoming | up-loy-2 | 7 |
| drill-row/09-row-cashback-upcoming | up-cb-mature | 9 |
| drill-row/09-row-loyalty-upcoming | up-loy-mature | 9 |

---

## 3. Activity feed

### 3.1 Baseline (minimal + full)

| id | file | step |
|----|------|------|
| activity/09-all-types | step-09-all-types.png | 9 |
| activity/09-type-sheet-open | step-09-type-sheet-open.png | 9 |
| activity/09-filter-cashback | step-09-filter-cashback.png | 9 |
| activity/01-empty-feed | step-01-empty-feed.png | 1 |

### 3.2 Extended (full)

| id | file | step |
|----|------|------|
| activity/09-via-lifetime-cashback | step-09-via-lifetime-cashback.png | 9 |
| activity/09-no-matches | step-09-no-matches.png | 9 (filter Others → empty) |
| activity/09-date-sheet-open | step-09-date-sheet-open.png | 9 |

### 3.3 Filter matrix (full)

Все комбинации **Type × Date** на шаге 9, кроме `all × all` (уже в baseline):

- Type: `all`, `rewards`, `cashback`, `transfers`, `others`
- Date: `all`, `last7`, `last30`, `thisMonth`

Files: `activity/step-09-filter-{type}-{date}.png` (19 shots).

---

## 4. RewardDetailModal — root (minimal + full)

| id | variant | step | surface |
|----|---------|------|---------|
| modals/loyalty-upcoming | loyalty-upcoming | 2 | drill EXD row |
| modals/loyalty-activated | loyalty-activated | 4 | activity preview |
| modals/cashback-upcoming | cashback-upcoming | 7 | drill USD row |
| modals/cashback-activated | cashback-activated | 8 | activity preview |
| modals/transfer-exd | transfer-exd | 6 | activity preview |
| modals/promo-gift | promo-gift | 5 | activity preview |
| modals/exd-adjustment | exd-adjustment | 4 | activity preview |

---

## 5. Feed → modal (full)

Якорь: `data-feed-item-id` на строках ленты.

| id | feed id | step | kindId |
|----|---------|------|--------|
| modals-feed/feed-exd-adjustment | feed-adj-1 | 4 | exd_adjustment |
| modals-feed/feed-loyalty-activated-mar18 | feed-loy-act-1 | 4 | loyalty_activated |
| modals-feed/feed-promo-gift | feed-gift-1 | 5 | promo_gift |
| modals-feed/feed-transfer-exd | feed-tr-1 | 6 | transfer_exd |
| modals-feed/feed-cashback-apr20 | feed-cb-apr19 | 9 | cashback_credited |
| modals-feed/feed-cashback-apr19 | feed-cb-apr18 | 9 | cashback_credited |
| modals-feed/feed-loyalty-apr1 | feed-loy-act-2 | 9 | loyalty_activated |
| modals-feed/feed-cashback-mar26 | feed-cb-mar25 | 9 | cashback_credited |
| modals-feed/feed-loyalty-mar25 | feed-loy-act-open | 9 | loyalty_activated |
| modals-feed/feed-cashback-mar25 | feed-cb-mar24 | 9 | cashback_credited |
| modals-feed/feed-cashback-mar24 | feed-cb-1 | 9 | cashback_credited |

---

## 6. Pack drill-down (full, step 7)

Сценарий: cashback upcoming → order `#9100821`.

| id | file | UI state |
|----|------|----------|
| modals-pack/cashback-upcoming-orders-list | cashback-upcoming-orders-list.png | See all |
| modals-pack/cashback-upcoming-order-detail | cashback-upcoming-order-detail.png | Cashback order leg |
| modals-pack/cashback-upcoming-sheet-exd-deducted | cashback-upcoming-sheet-exd-deducted.png | ⓘ EXD deducted |
| modals-pack/cashback-upcoming-sheet-cashback-rate | cashback-upcoming-sheet-cashback-rate.png | ⓘ Cashback rate |
| modals-pack/cashback-upcoming-closed-order | cashback-upcoming-closed-order.png | Order → closed order sheet |
| modals-pack/loyalty-upcoming-order-detail | loyalty-upcoming-order-detail.png | Loyalty order leg (drill EXD) |
| chart/order-9100821 | order-9100821.png | Chart + inline order panel |

---

## 7. Planned / not wired

| UI | status | note |
|----|--------|------|
| `cashback-activated-jan12` static pack | not-wired | нет строк в моках |
| `SpreadRebateLedgerScreen` | not-wired | не в `App.tsx` |
| `RewardCalculationSheet`, `EarningRateSheet`, … | not-wired | компоненты без mount |
| `HIDE_TRANSACTION_BADGES` | as-shipped | badges скрыты CSS |
| `HIDE_DAY_SUMMARY` | as-shipped | day summary скрыт |

---

## 8. Figma reuse

При переносе в Figma:

1. Full set → import PNG 375×812 @2x.
2. Сопоставление node-id — [`DESIGN.md`](DESIGN.md).
3. Обновлять `figma` колонку в этом файле по мере привязки.

---

## Changelog

| Date | Change |
|------|--------|
| 2026-06-10 | Full catalog runner + scroll sections + filter matrix + pack drill + feed modals |

**Новая фича:** добавить shot в `screenshot-shots.mjs`, строку в §1–7, прогнать `npm run screenshots`.
