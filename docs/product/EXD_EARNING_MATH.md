# Математика начисления EXD (Loyalty)

Документ фиксирует **продуктовую формулу** начисления EXD за закрытую сделку (Loyalty reward), связь с ногой **EXD → Cashback**, агрегацию в недельную пачку и границы scope. UX-путь и цифры симулятора — в [`REWARD_LIFECYCLE.md`](REWARD_LIFECYCLE.md); поля UI — в [`TRANSACTIONS_CATALOG.md`](TRANSACTIONS_CATALOG.md).

---

## 0. Связанные документы

| Документ | Роль |
|----------|------|
| [`REWARD_LIFECYCLE.md`](REWARD_LIFECYCLE.md) | Сценарий, Upcoming, активация, примеры дат |
| [`TRANSACTIONS_CATALOG.md`](TRANSACTIONS_CATALOG.md) | List / modal / order, Booster, Earning rate |
| [`TASK_SPREAD_REBATE.md`](../specs/TASK_SPREAD_REBATE.md) | **Отдельная** программа: 1% USD + 1% EXD от дневного спреда, T+60 |

---

## 1. Scope

### В scope

- **Loyalty EXD** за **одну закрытую сделку** → сумма в **Upcoming** → недельная активация в **Available rewards**.
- **EXD spent** на сделке (rebate с торгового счёта) и его влияние на базу для loyalty.
- **Earning rate** и **Booster** как множители в формуле (без алгоритма выставления rate).
- **Агрегация** по календарной неделе **пн–вс**.

### Out of scope (отдельные программы / TBD)

| Тема | Где описано |
|------|-------------|
| Как рассчитывается **earning rate** для пользователя | TBD — в UI не объясняем |
| **Spread rebate** (1% + 1%, T+60) | [`TASK_SPREAD_REBATE.md`](../specs/TASK_SPREAD_REBATE.md) |
| Lifetime cashback (исторический USD) | Отдельный источник, не формула loyalty |
| Возвраты / отмена сделок | TBD |

---

## 2. Формула (одна закрытая сделка)

Копирайт breakdown-экрана («How EXD were calculated?»):

> EXD are calculated from the **spread** of the closed trade, **reduced by any EXD spent**, then multiplied by the **earning rate** and any **active booster**.

```text
EXD_earned = max(0, Spread_USD − EXD_spent_USD) × earning_rate × booster
```

| Символ | Тип | Описание |
|--------|-----|----------|
| `Spread_USD` | USD | Спред закрытой сделки в USD (при другой валюте счёта — с конвертацией для отображения) |
| `EXD_spent_USD` | USD | Эквивалент EXD, списанных на rebate по **этой** сделке (см. §4) |
| `earning_rate` | безразмерный | Плавающий множитель на момент сделки; маркетингово **up to 7%** (0.07) |
| `booster` | безразмерный | Множитель активного тира, напр. **×2** для Ultimate |

**Порядок операций:** сначала вычитание EXD spent из spread, затем умножение на rate, затем на booster.

**Округление:** TBD (в UI — 2 знака после запятой для EXD).

---

## 3. Компоненты формулы

### 3.1 Spread

- База — **spread** закрытого ордера в **USD**.
- В breakdown при необходимости показываем исходную сумму и конвертацию, напр. `4,900 THB → 136 USD`.
- Источник для продукта — торговая система; в прототипе spread в breakdown **не** выводится из симулятора (статичный/демо контент).

### 3.2 EXD spent (уменьшение базы loyalty)

Если на торговом счёте есть EXD, часть спреда может быть «оплачена» EXD → отдельное событие **EXD → Cashback** (USD в Upcoming).

Для loyalty **та же** сумма (в USD-эквиваленте) **вычитается** из spread, чтобы не начислять EXD дважды на ту часть спреда, которую пользователь уже конвертировал в cashback.

| Поле в UI | Пример |
|-----------|--------|
| EXD spent | `-68.0 EXD` |
| Подпись курса | `1 EXD = 1 USD` (в дизайне breakdown) |

**Правило для моков lifecycle** (упрощение): при полном rebate **EXD spent = 50% × spread** (в USD-эквиваленте). См. [`REWARD_LIFECYCLE.md`](REWARD_LIFECYCLE.md) §1, §7.

**Прототип кода:** для leg cashback используется другой курс — `EXD_TO_USD_CASHBACK_RATE = 1.185` в [`tradingOrder.ts`](../../src/domain/reward/tradingOrder.ts). До выравнивания с prod в моках возможны расхождения USD ↔ EXD.

### 3.3 Earning rate

- **Переменный** множитель, привязанный к сделке / моменту закрытия.
- Потолок в коммуникации: **up to 7%** → `earning_rate ≤ 0.07` (если rate задаётся как доля от базы).
- Может **плавать вниз**; механизм выставления **не раскрываем** пользователю в первой итерации.
- В UI:
  - order detail: процент, напр. `5.34%` (демо в [`loyaltyOrderDetailRows.ts`](../../src/components/reward/RewardDetailModal/configs/loyaltyOrderDetailRows.ts));
  - breakdown: множитель, напр. `×0.124` (демо Figma — **не** обязано совпадать с 7% cap).

**Open:** относится ли «up to 7%» к rate **до** booster или к итогу `rate × booster`.

### 3.4 Booster

- Множитель от **тира** программы (напр. Ultimate · **×2**).
- Применяется **после** earning rate.
- В list order — chip `x2`; в order detail — tier chip «Ultimate · x2».

```text
effective_on_net = earning_rate × booster
```

Пример: rate = 5%, booster = ×2 → **10%** от net spread в EXD (при прочих равных).

---

## 4. EXD → Cashback (параллельная нога)

На **той же** сделке может одновременно существовать:

| Нога | Валюта | Куда | Статус |
|------|--------|------|--------|
| Loyalty reward | EXD | Upcoming (пачка недели) | Pending до среды |
| EXD → Cashback | USD | Upcoming → trading account | Pending до settlement (T+1 в lifecycle) |

Связь со spread (моки):

```text
EXD_spent_USD ≈ 50% × Spread_USD   // при достаточном EXD на счёте
Cashback_USD   ≈ EXD_spent_USD × k   // k = курс EXD→USD для cashback (prod TBD; в коде k = 1.185)
```

Сделка **без** EXD на счёте: `EXD_spent = 0`, cashback-нога **не** создаётся, loyalty считается от полного spread.

---

## 5. Агрегация (недельная пачка)

```text
Pack_EXD = Σ EXD_earned(order_i)
```

где сумма берётся по всем сделкам с **датой закрытия** в календарной неделе **понедельник–воскресенье**.

| UI | Значение |
|----|----------|
| Upcoming list | `Loyalty rewards` · `+N.NN EXD` · `For trading on Mar 16–22` |
| Дата справа | `on Mar 25` — зачисление в Available (среда после недели) |
| Modal pack | `orders[]` — по одной строке на сделку; сумма ордеров = сумма пачки |

Системное событие активации: `reward_activation` → одна строка в Activity feed на всю пачку.

---

## 6. Примеры расчёта

### 6.1 Сделка без EXD на счёте

| Параметр | Значение |
|----------|----------|
| Spread | 10 USD |
| EXD spent | 0 |
| earning_rate | 0.05 (5%) |
| booster | 2 |

```text
EXD = 10 × 0.05 × 2 = 1.00 EXD
```

Согласуется с моком lifecycle: spread 10 → **+1.0 EXD** (ордер #1001), если эффективно 5% × booster 2.

### 6.2 Сделка с EXD spent 50% (целевая формула)

| Параметр | Значение |
|----------|----------|
| Spread | 10 USD |
| EXD spent | 5 USD equiv. (50%) |
| earning_rate | 0.05 |
| booster | 2 |

```text
Net   = 10 − 5 = 5 USD
EXD   = 5 × 0.05 × 2 = 0.50 EXD
```

В [`REWARD_LIFECYCLE.md`](REWARD_LIFECYCLE.md) §7 для того же кейса в моке указано **+1.0 EXD** — это **упрощение прототипа** (`10% × spread` без вычитания spent). При внедрении breakdown и единой формулы моки симулятора нужно пересчитать.

### 6.3 Пример из breakdown (Figma / скрин)

| Параметр | Значение |
|----------|----------|
| Spread | 136.0 USD |
| EXD spent | 68.0 EXD (= 68 USD при 1:1) |
| earning_rate | 0.124 |
| booster | 2 |

```text
Net   = 136 − 68 = 68 USD
EXD   = 68 × 0.124 × 2 = 16.864 EXD
```

Число `0.124` в макете — **демо** для breakdown; с маркетинговым cap 7% на net даёт `68 × 0.07 × 2 = 9.52 EXD`. Перед продом сверить реальные rate/booster с бэкендом.

---

## 7. Отображение в UI

| Экран | Поля |
|-------|------|
| Order list (внутри pack) | Loyalty reward, сумма EXD, **x2** booster chip |
| Order detail | When, Account, Order ›, Booster tier, **Earning rate** › |
| **Earning rate sheet (v1)** | Hero: rate + subtitle; program max 7% в prose; lead + bullets; footnote — без алгоритма rate. UX: [`EARNING_RATE_EXPLAINER_UX.md`](../research/EARNING_RATE_EXPLAINER_UX.md); код: `earningRateExplainer.ts`, `EarningRateSheet.tsx` |
| Closed order | EXD earned, Cashback from EXD (из registry по Order ID) |
| Breakdown (v2 / Figma) | Spread, EXD spent (+ курс), Earning rate, Booster, поясняющий текст формулы |

**Формат earning rate в UI:** в order detail — процент (`5.34%`); в breakdown-макете может быть множитель (`×0.124`) — разные представления; sheet v1 использует значение из строки order detail.

---

## 8. Что не входит в эту формулу

| Механика | Поведение |
|----------|-----------|
| **Tier progress** «Earn 1000 EXD» | Считает **заработанный** loyalty (+ pending в Upcoming); **списание EXD на rebate не уменьшает** прогресс |
| **Spread rebate T+60** | 1% USD + 1% EXD от **дневного** спреда; **не** смешивать с per-order loyalty; EXD **не** идёт в tier progress |
| **Gift / adjustment / transfer** | Отдельные типы событий, без spread-формулы |

---

## 9. Прототип vs продуктовая формула

| | Продукт (этот документ) | Прототип сейчас |
|--|-------------------------|-----------------|
| Формула loyalty | `(spread − EXD spent) × rate × booster` | В lifecycle: **`10% × spread`** для цифр моков |
| EXD spent уменьшает loyalty-base | Да | Нет в цифрах §7 lifecycle |
| Rate / booster в расчёте | Да | Только в UI (статичные демо) |
| Breakdown «How EXD were calculated?» | Да | [`RewardCalculationSheet.tsx`](../../src/components/reward/RewardDetailModal/parts/RewardCalculationSheet.tsx) · [`loyaltyRewardCalculation.ts`](../../src/domain/reward/loyaltyRewardCalculation.ts) |
| Курс EXD→USD для cashback | TBD / 1:1 в breakdown | `1.185` в коде |

При обновлении симулятора: пересчитать `lifecycleSteps.ts` и пачки в `buildLoyaltyModalPack.ts` по §2 или явно пометить шаги как «legacy mock».

---

## 10. Open questions

1. **7% cap** — до или после booster?
2. **EXD spend cap** — всегда 50% spread или зависит от баланса EXD / инструмента / настроек счёта?
3. **Единый курс** EXD/USD для вычитания из базы loyalty и для cashback USD?
4. **Округление** на каждом шаге vs только на итоге ордера / пачки.
5. **Минимальные пороги** (min spread, min EXD per order).
6. Сверка демо-чисел Figma (`×0.124`, `5.34%`) с prod-калькулятором.

---

## 11. Чеклист при изменении логики

- [ ] Обновить этот документ и примеры в §6
- [ ] Пересчитать моки в [`REWARD_LIFECYCLE.md`](REWARD_LIFECYCLE.md) и `lifecycleSteps.ts`
- [ ] Согласовать [`TRANSACTIONS_CATALOG.md`](TRANSACTIONS_CATALOG.md) §4.1 order detail / breakdown поля
- [ ] Выровнять `EXD_TO_USD_CASHBACK_RATE` с prod или вынести в domain-константы с комментарием
- [ ] `npm run build` + прогон шагов симулятора 1→9
