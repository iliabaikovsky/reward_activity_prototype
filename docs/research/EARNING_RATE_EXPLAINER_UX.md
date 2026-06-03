# Earning rate explainer — UX benchmark (Mobbin)

Референсы и решения для stacked sheet **Earning rate** в Loyalty order detail (CE-3142). Дата: **Jun 2026**.

**Связанные документы:** [`FINTECH_TRANSACTION_DETAIL_UX.md`](FINTECH_TRANSACTION_DETAIL_UX.md) · [`EXD_EARNING_MATH.md`](../product/EXD_EARNING_MATH.md) · [`TRANSACTIONS_CATALOG.md`](../product/TRANSACTIONS_CATALOG.md) §4.1 · [`REWARD_CALCULATION_UX.md`](REWARD_CALCULATION_UX.md) (full math breakdown)

**Реализация:** [`earningRateExplainer.ts`](../../src/components/reward/RewardDetailModal/configs/earningRateExplainer.ts) · [`EarningRateSheet.tsx`](../../src/components/reward/RewardDetailModal/parts/EarningRateSheet.tsx)

---

## 1. Задача

По тапу на **Earning rate ⓘ** (order detail или Calculation sheet) — **короткое** объяснение:

- что такое earning rate и на какую базу он применяется;
- что rate **фиксируется на сделку**, но может **меняться** на будущих сделках;
- что **Booster** — отдельный множитель (до 7% = только rate, не × booster);
- **без** алгоритма выставления rate и **без** полного math breakdown (см. [`REWARD_CALCULATION_UX.md`](REWARD_CALCULATION_UX.md) — отдельный sheet).

---

## 2. Выбранные паттерны (E1 + E3)

| ID | Паттерн | Почему для Exness |
|----|---------|-------------------|
| **E1** | Крупный rate + 2 строки prose (без bullets) | Wealthsimple Interest — укорочено Jun 2026 |
| **E3** | Progressive disclosure: chevron на detail → stacked sheet | Как `ClosedOrderSheet`; order detail не перегружаем |

**Не выбрано:** inline Revolut-style explainer (E4) под строкой — у нас уже drill-down stack.

---

## 3. Mobbin references

| App | Что берём | Mobbin |
|-----|-----------|--------|
| Wealthsimple | Sheet: title + rate badge + paragraph + earnings context | [Interest](https://mobbin.com/screens/33cb9e82-faec-44a0-bc01-904f782a45f6), [Spend rewards](https://mobbin.com/screens/847e749e-e82c-4fbf-aa36-a2bfa76b1ea1) |
| Chase UK | «Up to» cap, «Exceptions apply», HOW IT WORKS steps (program-level) | [1% Cashback](https://mobbin.com/screens/992dc5b7-3b89-4587-a5cb-150c662a9570), [How it works](https://mobbin.com/screens/54753331-c5a2-4911-a4ce-f643c849233e) |
| Revolut | `(i)` / blue fee + explanation block под карточкой | [Fees card](https://mobbin.com/screens/3f5743c6-7f49-49ba-95fd-ef688330288c) |
| Neo Financial | «Avg.» vs «At least» — честность при плавающем rate | [My Plan](https://mobbin.com/screens/635bbb84-5d13-4a1a-a39d-0684202c82a2) |
| Rakuten | «How to get» + «The fine print» — структура disclosure | [Reward Details](https://mobbin.com/screens/8f4bd4da-04bf-4610-9be2-cf8ec7dbd1be) |

---

## 4. IA v1 (прототип)

| Элемент | Решение |
|---------|---------|
| Контейнер | `ModalSheet` `detent="medium"` `stacked` |
| Header | Close (X) + title **Earning rate** |
| Hero | Только rate из order row (напр. `5.34%`) |
| Body | `EARNING_RATE_LEAD` + `EARNING_RATE_SECONDARY` (locked, program max 7%, may change) |
| Нет | Subtitle, bullets, footnote, Booster paragraph (см. Calculation / order detail) |

**Copy (EN, Jun 2026):**

- *Percent of spread used for EXD on this trade, after any EXD spent on cashback.*
- *Locked at order close. Program max 7%. Rate may change on future trades.*

---

## 5. Copy v1 (EN)

См. константы в [`earningRateExplainer.ts`](../../src/components/reward/RewardDetailModal/configs/earningRateExplainer.ts).

---

## 6. Out of scope v1 (earning rate sheet only)

- Полный breakdown spread / EXD spent / × rate / × booster → [`REWARD_CALCULATION_UX.md`](REWARD_CALCULATION_UX.md)
- Динамический rate из симулятора
- Booster explainer sheet
- Legal T&C / exceptions list
