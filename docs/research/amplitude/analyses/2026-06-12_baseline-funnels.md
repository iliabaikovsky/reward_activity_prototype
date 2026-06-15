# Baseline metrics & funnels — Mobile Trader Area (207818)

**Date:** 2026-06-12  
**Period:** Last 30 Days (Amplitude preset)  
**Project:** Mobile Trader Area · `207818`  
**Method:** Amplitude MCP `query_dataset` — funnels + segmentation  

> Документ содержит **только наблюдаемые цифры**. Интерпретации и «почему» — отдельным шагом после ревью.

---

## 1. `value_segment` — состав пользователей

User property: `gp:value_segment`. Значения: **`0`, `1`, `2`, `3`, `4`** + **`(none)`** (не задан).

Composition (Last 30 Days, users):

| value_segment | Users | Share |
|---------------|------:|------:|
| (none) | 1,414,416 | 45.6% |
| 1 | 1,078,042 | 34.8% |
| 0 | 537,363 | 17.3% |
| 2 | 63,222 | 2.0% |
| 3 | 6,921 | 0.22% |
| 4 | 1,733 | 0.06% |
| **Total** | **3,101,697** | 100% |

Сегменты **0–4** — пять пронумерованных групп; почти половина MAU без property.

---

## 2. Охват Rewards home

Proxy «пользователь на главной Rewards»: `exd_total_value_shown`.

| Metric | Unique users (L30D) |
|--------|--------------------:|
| `exd_total_value_shown` | **95,083** |
| `exd_wallet_clicked` | (см. §4 — выше, чем total_value) |
| `exd_transaction_history_clicked` | **34,685** (funnel F2 step 1) / **~35k** в event chart |

Доля от app active: `_active` в monthly buckets ~3.26M / ~2.02M — **deduped MAU за полный L30D в этом запросе не получен**; грубо Rewards home ≈ **95k users** при миллионах active.

---

## 3. Воронки (ordered, conversion window default)

### F1 — Rewards home → Activity feed

`exd_total_value_shown` → `exd_transaction_history_clicked`

| | Users | Conversion |
|--|------:|-----------:|
| Step 1 | 95,083 | — |
| Step 2 | 27,478 | **28.9%** |
| Median time step 1→2 | | **133 s** |

**По value_segment:**

| Segment | Step 1 | Step 2 | Conversion |
|---------|-------:|-------:|-----------:|
| 1 | 60,208 | 19,072 | **31.7%** |
| 0 | 1,913 | 540 | 28.2% |
| 2 | 29,253 | 6,913 | 23.6% |
| 3 | 4,474 | 961 | 21.5% |
| 4 | 1,222 | 273 | 22.3% |
| **All** | **95,083** | **27,478** | **28.9%** |

---

### F2 — Activity → фильтры

**F2b** `exd_transaction_history_clicked` → `exd_rewards_activity_filter_by_date_clicked`

| Step 1 | Step 2 | Conversion |
|-------:|-------:|-----------:|
| 34,685 | 6,299 | **18.2%** |
| Median time | | **30 s** |

**F2c** `exd_transaction_history_clicked` → `exd_rewards_activity_filter_by_state_clicked`

| Step 1 | Step 2 | Conversion |
|-------:|-------:|-----------:|
| 34,685 | 0 | **0%** |

**Event totals (не funnel):**

| Event | Total events L30D |
|-------|------------------:|
| `exd_rewards_activity_filter_by_date_clicked` | **14,211** (8684+5527 по месяцам) |
| `exd_rewards_activity_filter_by_state_clicked` | **0** |

---

### F3 — Entry: Accounts → Rewards home

`exd_on_accounts_clicked` → `exd_total_value_shown`

| Step 1 | Step 2 | Conversion |
|-------:|-------:|-----------:|
| 40,567 | 19,239 | **47.4%** |
| Median time | | **6,069 s (~101 min)** |

---

### F4 — Entry: Pre-opt-in banner → Rewards home

`exd_rewards_pre_opt_in_banner_clicked` → `exd_total_value_shown`

| Step 1 | Step 2 | Conversion |
|-------:|-------:|-----------:|
| 771 | 119 | **15.4%** |

---

### F5 — Transfer

`exd_transfer_clicked` → `exd_transfer_confirm`

| Step 1 | Step 2 | Conversion |
|-------:|-------:|-----------:|
| 83,921 | 75,786 | **90.3%** |
| Median time | | **20 s** |

---

### F6 — Entry: Balance click → Rewards home

`exd_balance_clicked` → `exd_total_value_shown`

| Step 1 | Step 2 | Conversion |
|-------:|-------:|-----------:|
| 60,512 | 26,616 | **44.0%** |
| Median time | | **386 s** |

---

## 4. Объёмы ключевых events (unique users, L30D — funnel totals где есть)

| Event | Unique users |
|-------|-------------:|
| `exd_total_value_shown` | 95,083 |
| `exd_wallet_clicked` | ~154k+ (monthly buckets; **> total_value** — клик не только с Rewards home) |
| `exd_on_accounts_clicked` | 40,567 |
| `exd_balance_clicked` | 60,512 (funnel step 1) |
| `exd_transaction_history_clicked` | 34,685 |
| `exd_transfer_clicked` | 83,921 |
| `exd_transfer_confirm` | 75,786 |
| `exd_rewards_pre_opt_in_banner_clicked` | 771 |
| `exd_rewards_popup_button_clicked` | ~35k–55k (monthly buckets) |

---

## 5. Events без данных / deprecated

| Event | L30D volume |
|-------|------------|
| `home_did_load` | **0** uniques |
| `accounts_tab_click` | **0** |
| `tab_selected` | **0** |
| `exd_rewards_activity_filter_by_state_clicked` | **0** totals |

---

## 6. Существующие charts в Amplitude (reference)

| Chart | Type | Note |
|-------|------|------|
| [EXD Common landing page conversion](https://app.amplitude.com/analytics/exness/chart/pu9vrno5) | Funnel | intro → continue; **51 users**, 2% conv (stale/low traffic) |
| [EXD dashboard](https://app.amplitude.com/analytics/exness/dashboard/z6a3y8wa) | Dashboard | 30 charts, multi-project |
| [Pilot 16 Opt in](https://app.amplitude.com/analytics/exness/dashboard/6csjj784) | Dashboard | Experiment |

---

## 7. Data gaps (факты, не выводы)

- Нет рабочего event для app home load в L30D (`home_did_load` = 0).
- Нет volume у Type/state filter event при ненулевом Date filter.
- Funnel step 1 для entry paths **не суммируются** до 95k — paths overlap; total Rewards home = отдельный счётчик.
- Modal drill / row tap — events не найдены в taxonomy (см. DATA_QUALITY.md).

---

## Next step (после ревью цифр)

Обсудить интерпретацию: drop-off F1 (~71%), F3 vs F6 entry paths, segment 1 vs 2–4 conversion delta, state filter instrumentation.
