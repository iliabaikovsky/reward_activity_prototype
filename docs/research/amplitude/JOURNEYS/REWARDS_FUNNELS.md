# Rewards funnels — inside EXD section

Funnels **after** user reached Rewards (see [`ENTRY_PATHS.md`](ENTRY_PATHS.md) for acquisition).

Segment all funnels by **`value_segment`** unless noted.

---

## F1 — Rewards home engagement

| Step | Event |
|------|-------|
| 1 | `exd_total_value_shown` |
| 2 | `exd_wallet_clicked` OR `exd_balance_clicked` |
| 3 | `exd_upcoming_cashback_shown` (impression) |
| 4 | `exd_transaction_history_clicked` |

**Question:** Do users who see Upcoming also open Activity?

---

## F2 — Activity feed depth (CE-3142)

| Step | Event |
|------|-------|
| 1 | `exd_transaction_history_clicked` |
| 2 | `exd_rewards_activity_filter_by_state_clicked` |
| 3 | `exd_rewards_activity_filter_by_date_clicked` |

**Question:** Filter adoption rate; Type vs Date which is used more?

**Gap:** steps 4+ (row tap → modal → order detail) not instrumented yet.

---

## F3 — Transfer flow

| Step | Event |
|------|-------|
| 1 | `exd_transfer_clicked` |
| 2 | `exd_transfer_account_selected_in_popup` |
| 3 | `exd_transfer_confirm` OR `exd_transfer_between_accounts_confirmed` |

**Question:** Drop-off by value_segment and tier.

---

## F4 — Activation (new users)

| Step | Event |
|------|-------|
| 1 | `exd_rewards_pre_opt_in_banner_clicked` OR popup shown |
| 2 | `exd_rewards_opt_in_clicked` |
| 3 | `exd_rewards_opt_in_tc_clicked` |
| 4 | `exd_total_value_shown` (post activation) |

---

## F5 — Tier / benefits exploration

| Step | Event |
|------|-------|
| 1 | `exd_rewards_tier_with_benefits_shown` |
| 2 | `exd_rewards_benefit_clicked` |
| 3 | `exd_rewards_benefit_details_clicked` |

---

## Holding properties (when available)

For multi-step funnels, hold constant where applicable:

- `account_id` / account property on transfer events
- Filter value on `exd_rewards_activity_filter_by_*` (property audit needed)

---

## Chart backlog

| Funnel | Priority | Status |
|--------|----------|--------|
| F1 overall + by value_segment | P0 | Not built |
| F2 Activity + filters | P0 | Not built |
| Entry → F1 combined | P0 | Not built |
| F3 Transfer | P1 | Not built |
| F4 Activation | P2 | Not built |

Links after creation: [`CHART_INDEX.md`](../links/CHART_INDEX.md)
