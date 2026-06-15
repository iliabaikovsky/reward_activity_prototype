# Questions backlog — Amplitude research

**Правило:** сначала **данные** (`analyses/`), потом вопросы. Не добавлять гипотезы до baseline metrics.

---

## Answered by data (2026-06-12)

См. [`analyses/2026-06-12_baseline-funnels.md`](../analyses/2026-06-12_baseline-funnels.md).

---

## Open — для обсуждения после ревью цифр

1. F1: ~71% users на Rewards home не открывают Activity — что смотреть дальше (pathing, replay)?
2. F2c: state filter event = 0 — не задеployено или другое имя?
3. Entry paths F3/F4/F6 — как сравнить вклад в 95k total_value без overlap analysis?
4. Segment 1 conversion 31.7% vs 2–4 (~21–24%) — статзначимость / размер выборки seg 3–4
5. `home_did_load` / `tab_selected` = 0 — какой актуальный proxy для app home?

---

## Chart backlog (data collection)

| ID | Query | Status |
|----|-------|--------|
| D1 | Baseline funnels + segments | Done → analysis memo |
| D2 | Pathing: events before first `exd_total_value_shown` | Queued |
| D3 | iOS vs Android breakdown key events | Queued |
| D4 | `tab_selected` / navigation property audit | Queued |
| D5 | Pilot 16 dashboard charts (existing) | Queued |
