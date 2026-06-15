# EXD event naming conventions

Source of truth: Amplitude org `aiContext` (Exness Global Inc.) + observed `exd_*` taxonomy in project **207818**.

## Rules

| Rule | Example |
|------|---------|
| snake_case | `exd_wallet_clicked` |
| object_action (noun + past-tense verb) | `exd_transfer_confirm` |
| EXD prefix for loyalty program surface | `exd_rewards_*`, `exd_transfer_*` |
| Properties: snake_case | `account_type`, `value_segment` |

## Anti-patterns (observed in 207818)

| Bad | Why |
|-----|-----|
| `exd onload`, `exd 1020` | Noise / broken instrumentation — see [`DATA_QUALITY.md`](DATA_QUALITY.md) |
| `Tab Changed` (Title Case) | Legacy naming; prefer `tab_selected` where available |
| Dynamic event names | Use one event + property instead |

## CE-3142 alignment

Prototype screens use product names (Rewards, Activity feed); Amplitude uses **`exd_*`** prefix. Map in [`EXD_EVENTS_CATALOG.md`](EXD_EVENTS_CATALOG.md).

When proposing **new** events for CE-3142 rollout (modal drill, order detail):

- Follow `exd_rewards_*` or `exd_activity_*` namespace
- Add `source` / `entry_point` property on navigation events
- Document in catalog before implementation
