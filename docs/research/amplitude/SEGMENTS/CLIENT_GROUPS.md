# Client groups & segments — Mobile Trader Area (207818)

Для CE-3142 анализы **по умолчанию** режем по **`value_segment`** (~5 групп клиентов по ценности). Дополнительные оси — tier, reward schema, pilot cohorts.

Last discovery: **12 Jun 2026** (Amplitude MCP).

---

## Primary: value_segment (groups 0–4)

| Amplitude | Type | Notes |
|-----------|------|-------|
| `value_segment` | User property (`gp:value_segment`) | Values **`0`, `1`, `2`, `3`, `4`** + **`(none)`** |

**Observed distribution (L30D, 2026-06-12):** см. [`analyses/2026-06-12_baseline-funnels.md`](../analyses/2026-06-12_baseline-funnels.md) §1.

| value_segment | Share of users |
|---------------|---------------:|
| (none) | 45.6% |
| 1 | 34.8% |
| 0 | 17.3% |
| 2 | 2.0% |
| 3 | 0.22% |
| 4 | 0.06% |

Numeric scale **0 = lowest, 4 = highest** (inferred from cohort names «Value Segment 2-4» and volume gradient) — **confirm with business owner**.

### Analysis rule

Every chart / funnel in CE-3142 research:

1. **Overall** (all users)
2. **Breakdown by `value_segment`** (5 groups)
3. Optional: filter one segment for deep-dive

Compare segments with Amplitude MCP skill `compare-user-journeys` or chart breakdown.

---

## EXD program dimensions

| Property | Type | Use |
|----------|------|-----|
| `tier` | User property | EXD loyalty tier (Ultimate, etc.) — overlay on value_segment |
| `reward_schemas` | User property | Program variant / accrual schema |

---

## Experiment & pilot cohorts (do not confuse with value_segment)

These are **rollout / A/B groups**, not the 5 client value groups:

| Cohort name | Context |
|-------------|---------|
| `Pilot 14 Exness Rewards \| Mobile cohort` | Exness Rewards rollout |
| `Pilot 16 Control 31.10.2025 \| Mobile` | Recent pilot control |
| `Pilot 16 Test 31.10.2025 \| Mobile` | Recent pilot test |
| `Exness Rewards Roll out \| Test 1 with opt in \| Mobile cohort` | Opt-in variant |
| `Exness Rewards Roll out \| Test 2 No opt in \| Gobal cohort` | No opt-in variant |
| `EXD Pilot 11 \| Mobile cohort` (+ Control/Test sub-cohorts) | Onboarding experiment |
| `EXD Upcoming cashback Control group \| Mobile` | Upcoming cashback A/B |
| `EXD Upcoming cashback Test group \| Mobile` | |
| `Daily rewards \| Control \| Mobile` / `Test \| Mobile` | Daily rewards |

Use pilot cohorts only when measuring **experiment impact**, not for general CE-3142 UX baseline.

---

## Platform & geo (secondary)

| Dimension | Source |
|-----------|--------|
| iOS vs Android | Platform user/event property, saved segment `iOS` |
| Region | Cohorts: MENA, LATAM, SSA, TH, etc. |

---

## Segment × metric matrix (planned)

| Metric | By value_segment | By tier | By pilot |
|--------|------------------|---------|----------|
| Home → Rewards reach | Yes | Optional | Experiment only |
| Activity feed open rate | Yes | Optional | No |
| Filter usage | Yes | Optional | No |
| Transfer funnel | Yes | Yes | No |
| Modal drill (when instrumented) | Yes | Optional | No |

Fill baseline numbers in `analyses/` after first chart run.
