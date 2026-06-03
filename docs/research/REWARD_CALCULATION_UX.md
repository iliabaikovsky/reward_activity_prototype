# Reward calculation UX (Loyalty order)

Спека по Figma CE-3142: **42413:32765** (order detail + Calculation row), **42413:33231** (Calculation sheet). Дата: **Jun 2026**.

**Связанные документы:** [`EXD_EARNING_MATH.md`](../product/EXD_EARNING_MATH.md) · [`TRANSACTIONS_CATALOG.md`](../product/TRANSACTIONS_CATALOG.md) §4.1 · [`EARNING_RATE_EXPLAINER_UX.md`](EARNING_RATE_EXPLAINER_UX.md)

**Реализация:** [`loyaltyOrderDetailRows.ts`](../../src/components/reward/RewardDetailModal/configs/loyaltyOrderDetailRows.ts) · [`RewardCalculationSheet.tsx`](../../src/components/reward/RewardDetailModal/parts/RewardCalculationSheet.tsx) · [`loyaltyRewardCalculation.ts`](../../src/domain/reward/loyaltyRewardCalculation.ts)

---

## 1. Loyalty reward detail (Figma 42413:32765)

Единственное добавление — строка **Calculation** внизу списка. Остальные поля и порядок по макету:

```text
│  Earned on / Posted on    {datetime}      │
│  Account                  {account}       │
│  Order                    {id}        › │
│  Earning rate             5.34%       ⓘ │  info icon, не chevron
│  Booster                  [tier chip]   │
│  Calculation              Details     › │  последняя строка
```

| Row | Value | Affordance |
|-----|-------|------------|
| Calculation | `Details` | Chevron → Calculation sheet |
| Earning rate | `5.34%` | `IconInfoCircle` → Earning rate sheet (v1) |

---

## 2. Calculation sheet (Figma 42413:33231)

`ModalSheet` `stacked`, title **Calculation**, back **chevron-left** (не X).

```text
│  ←  Calculation                          │
│                                         │
│  (10.49 - 0) × 5.34% × 2 = 1.12 EXD    │  20px semibold, center
│  (Spread − EXD spent…) × Earning rate…  │  14px secondary, center
│                                         │
│  Spread                   10.49 USD     │  optional sub: THB → USD
│  EXD spent on cashback    0 EXD         │  sub: 1 EXD → 1 USD
│  Earning rate             5.34%       ⓘ │  → Earning rate sheet
│  Booster                  [x2 chip]     │
```

- Нет отдельного hero +1.07 / order / account на этом экране.
- Нет карточек Breakdown / View order / footnote (только формула + table rows).
- **Earning rate** на calculation sheet тоже открывает Earning rate bottom sheet (stacked поверх).

---

## 3. Copy (EN)

[`rewardCalculationExplainer.ts`](../../src/components/reward/RewardDetailModal/configs/rewardCalculationExplainer.ts)

---

## 4. Интеракции

| Action | Result |
|--------|--------|
| `Calculation` → Details › | Calculation sheet |
| Back на Calculation | Order detail |
| `Earning rate` ⓘ (order detail или calculation) | Earning rate sheet |
| `Order` › | Closed order sheet |

Escape: верхний stacked sheet. Допустимо Calculation + Earning rate одновременно (earning rate поверх).

---

## 5. Data consistency

Формула в hero: `(spread - exd_spent) × rate% × booster = EXD`. Цифры сходятся с hero amount на order detail. См. [`EXD_EARNING_MATH.md`](../product/EXD_EARNING_MATH.md) §2.
