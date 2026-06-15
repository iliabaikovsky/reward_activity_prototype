# EXD events catalog — Mobile Trader Area (207818)

Ingested event names (`exd_*`). Last inventory: **12 Jun 2026** via Amplitude MCP `search`.

**Total product events:** 80 · **Noise:** see [`DATA_QUALITY.md`](DATA_QUALITY.md)

Legend: **CE-3142** = maps to prototype screen in CE-3142.

---

## 1. Rewards home (CE-3142: ExnessRewardsScreen)

| Event | CE-3142 | Notes |
|-------|---------|-------|
| `exd_total_value_shown` | Hero / lifetime | Proxy «Rewards screen viewed» |
| `exd_wallet_clicked` | Wallets | |
| `exd_balance_clicked` | Wallets / balance | |
| `exd_upcoming_cashback_shown` | Upcoming cell | USD aggregate in prototype |
| `exd_rewards_swiped` | Carousel / program | |
| `exd_rewards_tiers_swipe` | Tier progress | |
| `exd_rewards_tier_with_benefits_shown` | Tier + benefits | |
| `exd_rewards_benefits_scroll` | Benefits list | |
| `exd_rewards_benefit_clicked` | Benefit row | |
| `exd_rewards_benefit_details_clicked` | Benefit detail | |
| `exd_rewards_benefit_request_confirmation_closed` | Confirmation sheet | |
| `exd_rewards_trading_days_info_clicked` | Tier info | |
| `exd_program_swipe` | Program carousel | |
| `exd_info_clicked` | Info affordance | |
| `exd_info_program_clicked` | Program info | |
| `exd_about_exd_faq_clicked` | FAQ | |
| `exd_account_selected` | Account picker | |
| `exd_on_accounts_clicked` | Entry from Accounts tab | See [`ENTRY_PATHS.md`](../JOURNEYS/ENTRY_PATHS.md) |
| `exd_wrong` | Error state? | Investigate |

---

## 2. Activity feed (CE-3142: ActivityFeedScreen)

| Event | CE-3142 | Notes |
|-------|---------|-------|
| `exd_transaction_history_clicked` | Open Activity feed | Primary entry to full feed |
| `exd_rewards_activity_filter_by_date_clicked` | Date filter chip | Added Apr 2026 |
| `exd_rewards_activity_filter_by_state_clicked` | Type/state filter | Maps to Type filter in prototype |

**Gap:** no explicit row-tap / modal-open events for transaction detail.

---

## 3. Transfer (CE-3142: step 6)

| Event | CE-3142 | Notes |
|-------|---------|-------|
| `exd_transfer_clicked` | Start transfer | |
| `exd_transfer_confirm` | Confirm | |
| `exd_transfer_between_accounts_clicked` | Between accounts | |
| `exd_transfer_between_accounts_confirmed` | Confirmed | |
| `exd_transfer_account_selected_in_popup` | Account picker | |
| `exd_first_time_transfer_exd_notification_shown` | First-time nudge | |
| `exd_first_time_transfer_exd_notification_closed` | Dismiss | |

---

## 4. Activation & opt-in

| Event | CE-3142 step | Notes |
|-------|--------------|-------|
| `exd_rewards_opt_in_clicked` | Activation | |
| `exd_rewards_opt_in_tc_clicked` | T&C | |
| `exd_rewards_pre_opt_in_banner_clicked` | Pre-opt banner | Entry path |
| `exd_rewards_activation_popup_shown` | Popup | |
| `exd_rewards_activation_popup_closed` | | |
| `exd_rewards_activation_popup_profile_clicked` | | |
| `exd_rewards_activation_about_clicked` | | |
| `exd_after_allocation_info_shown` | Post-allocation | |
| `exd_after_allocation_info_closed` | | |

---

## 5. Onboarding & intro

| Event | Notes |
|-------|-------|
| `exd_onboarding_rewards_shown` | Rewards onboarding |
| `exd_onboarding_rewards_closed` | |
| `exd_onboarding_v2_shown` | v2 flow |
| `exd_onboarding_v2_closed` | |
| `exd_intro_screen_shown` | Intro |
| `exd_intro_screen_continue_clicked` | |
| `exd_intro_screen_learn_clicked` | |
| `exd_intro_screen_closed` | |

---

## 6. Popups & banners

| Event | Notes |
|-------|-------|
| `exd_rewards_popup_shown` | Generic rewards popup |
| `exd_rewards_popup_closed` | |
| `exd_rewards_popup_button_clicked` | |
| `exd_dynamic_popup_shown` | Dynamic promo |
| `exd_dynamic_popup_clicked` | |
| `exd_dynamic_popup_close` / `_closed` | |
| `exd_cashback_popup_shown` | Cashback promo |
| `exd_cashback_popup_learn_more` | |
| `exd_first_cashback_popup_shown` | First cashback |
| `exd_first_cashback_popup_learn_more` | |
| `exd_first_cashback_popup_close` | |
| `exd_app_update_needed_shown` | Force update |
| `exd_update_app_notification_shown` | Update nudge |

---

## 7. Daily rewards (parallel program)

| Event | Notes |
|-------|-------|
| `exd_daily_rewards_shown` | |
| `exd_daily_rewards_claim_now_clicked` | |
| `exd_daily_rewards_account_selected` | |
| `exd_daily_rewards_select_account_clicked` | |
| `exd_daily_rewards_select_account_error` | |
| `exd_daily_rewards_progress_banner_shown` | |
| `exd_daily_rewards_progress_banner_closed` | |
| `exd_daily_rewards_credited_banner_shown` | |
| `exd_daily_rewards_credited_banner_closed` | |

---

## 8. Crypto lander (entry path)

| Event | Notes |
|-------|-------|
| `exd_crypto_lander_about_EXD_clicked` | |
| `exd_crypto_lander_deposit_clicked` | |
| `exd_crypto_lander_how_to_clicked` | |
| `exd_crypto_lander_T&Cs_clicked` | |

---

## 9. Legacy pilots (experiments)

| Event | Notes |
|-------|-------|
| `exd_pilot_2_available_popup_shown` | Pilot 2 |
| `exd_pilot_2_available_popup_clicked` | |
| `exd_pilot_2_available_popup_close` | |
| `exd_pilot_5_activation_popup_shown` | Pilot 5 |
| `exd_pilot_5_activation_popup_clicked` | |
| `exd_pilot_5_activation_popup_closed` | |

Cross-ref cohorts: [`CLIENT_GROUPS.md`](../SEGMENTS/CLIENT_GROUPS.md)

---

## Related non-exd events (entry / shell)

| Event | Role |
|-------|------|
| `home_did_load` | App home — funnel start |
| `tab_selected` | Bottom nav (check tab property) |
| `Tab Changed` | Legacy tab change |
| `accounts_tab_shown` / `accounts_tab_click` | Accounts area |
| `Wallet accounts menu item in balance drop down widget clicked` | Balance widget → wallets |
