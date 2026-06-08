# Урезанная версия: без Calculation sheets, cashback rate inline, feed totals, chart stub

Ветка: `feature/no-calculation-explainer`. Checkpoint полной версии: `checkpoint/with-calculation-explainer`.

**Вне скоупа этой задачи:** ревью копирайта «более финансово» — отдельный тикет.

---

## 1. Loyalty order detail — скрыть Earning rate и Calculation

**Где:** `loyaltyOrderDetailRows.ts` → `DetailFieldList` в order detail (`OrderDetailView`).

**Сделать:** убрать из массива `details` строки:

- `Earning rate` (+ `infoIcon`)
- `Calculation` / `Details` (+ chevron)

**Оставить:** When (`Earned on` / `Posted on`) → Account → Order › → Booster.

**Модалка:** не открывать `EarningRateSheet` / `RewardCalculationSheet` для loyalty (state и рендер можно удалить или оставить мёртвым кодом — предпочтительно убрать wiring в `RewardDetailModal.tsx`).

---

## 2. Cashback order detail — Cashback rate вместо Calculation

**Где:** `cashbackOrderDetailRows.ts`, `cashbackUpcomingOrderDetailRows()`.

**Сделать:**

| Было | Стало |
|------|--------|
| `Calculation` → `Details` (chevron → sheet) | **`Cashback rate`** → значение **`50% of spread`** + **`infoIcon`** (без chevron) |

**EXD debited** — без изменений (info → `ExdCashbackDebitExplainerSheet`; убрать отсылку «Open Calculation» из copy).

**Новый sheet:** короткий `CashbackRateSheet` (или переиспользовать упрощённый copy из `rebateShareExplainer.ts`) — только про 50% от спреда, **без** USD spread и без nested `RebateShareSheet`.

**Убрать:** `CashbackCalculationSheet`, `RebateShareSheet`, строки Calculation в cashback rows, `calculationKind === 'cashback'`.

**Константа:** `CASHBACK_REBATE_SHARE_PERCENT = 50` в одном config-файле.

---

## 3. Converted on (EXD → USD)

**Order leg (первая строка):** всегда **Converted on** (upcoming и credited — EXD уже сконвертирован; pack **Credits on** / **Credited on** = зачисление USD на счёт).

| Leg | Value source | Info sheet |
|-----|--------------|------------|
| Upcoming | UTC = pack **Credits on** | `CashbackConversionSheet` |
| Credited | UTC = pack **Credited on** | same |

`valueDisplay: modalDatetime` — одна строка, без переноса UTC.

Copy: [`cashbackConversionExplainer.ts`](../../src/components/reward/RewardDetailModal/configs/cashbackConversionExplainer.ts).

Pack hero без изменений (**Credits on** / **Credited on** на агрегате).

---

## 4. Порядок полей cashback order (сверка с каталогом)

Источник: [`TRANSACTIONS_CATALOG.md`](../product/TRANSACTIONS_CATALOG.md) §4.3, §4.8.

### Upcoming leg (USD hero)

**Канон:** `To account` → `EXD debited` (info) → `For trading with EXD on` → `Order` › → `Cashback rate` (info).

Текущий порядок в `cashbackUpcomingOrderDetailRows` — **совпадает** (Calculation заменяется на Cashback rate в конце).

### Credited leg

**Канон (§4.8):** When **`Debited on`** → **`From account`** → Why **`For trading with EXD on`** → Other **`Order`** › → rate.

Текущий `cashbackOrderDetailRows` — **совпадает**.

Pack-level credited hero: **When → To account → Why** (§4.4) — без изменений в этой задаче.

---

## 4. Activity feed — итог по типу фильтра

**Где:** `ActivityFeedScreen.tsx`, `domain/reward/activityFeedSummary.ts` (новый).

**Поведение:**

| `typeFilter` | Показ под чипами фильтров |
|--------------|---------------------------|
| `all` | Не показывать strip (или опционально «N transactions» — **не делаем** в v1) |
| `rewards` | `N rewards · +X.XX EXD` (сумма `parseExdAmount` по отфильтрованным items) |
| `cashback` | `N cashback · +X.XX USD` (`parseSignedAmount`) |
| `transfers` / `others` | `N transfers · …` / `N others · …` по той же схеме |

Учитывать **оба** фильтра: type + date (`filterFeedGroups`).

Пустой результат: не показывать strip или «0 rewards · +0.00 EXD» — **показывать только если count > 0**.

`HIDE_DAY_SUMMARY` — без изменений (дневные суммы остаются скрыты).

---

## 5. View chart — отдельный экран + возврат в Exness Rewards

**Новый экран:** `OrderChartScreen` (stub: symbol, простой «график», back).

**Навигация (`App.tsx`):**

```text
route: 'rewards' | 'activity' | 'chart'
chartReturn: {
  fromRoute: 'rewards' | 'activity'
  rewardModal: { variant, itemId? }
  resumeOrderNum: string   // trading order # из closed order
}
```

**Flow:**

1. Пользователь в `RewardDetailModal` → order detail → `ClosedOrderSheet` → tap **View chart**.
2. `App` сохраняет `chartReturn`, закрывает модалку (`rewardModal = null`), `route = 'chart'`.
3. **Back** / **Back to Exness Rewards** на chart → `route = 'rewards'`, модалка **не** восстанавливается. Экран: **split layout** — `chartRegion` (flex 1, сжимается) + `detailRegion` с `ClosedOrderPanel` inline (не portal overlay).

**Rewards** chevron в closed order: не вести на Exness Rewards hub (остаётся back к order detail) — без изменений логики, только chart уходит на отдельный route.

---

## 6. Файлы (чеклист реализации)

- [x] `docs/specs/NO_CALCULATION_EXPLAINER_SPEC.md` (этот файл)
- [x] `loyaltyOrderDetailRows.ts` — убрать 2 строки
- [x] `cashbackOrderDetailRows.ts` + `cashbackRateExplainer.ts` + `cashbackConversionExplainer.ts` + `CashbackConversionSheet`
- [x] `cashbackExdDebitExplainer.ts` — убрать Calculation в secondary
- [x] `DetailHero.tsx` — handler `Cashback rate` info
- [x] `RewardDetailModal.tsx` — sheets, resume, `onOpenChart`
- [x] `ClosedOrderSheet.tsx` — click Chart row
- [x] `OrderChartScreen.tsx` + CSS
- [x] `App.tsx` — route chart + return stack
- [x] `activityFeedSummary.ts` + `ActivityFeedScreen`
- [x] `TRANSACTIONS_CATALOG.md` — §4.3 order fields (Calculation → Cashback rate)
- [x] `npm run build`

---

## Отложено

| Тикет | Описание |
|-------|----------|
| Copy — более финансовый тон | Отдельная задача; не менять labels в этой ветке |
| Birthday gift visual | Не в этом scope |
| Feed day-level `summary` | `HIDE_DAY_SUMMARY` остаётся true |
