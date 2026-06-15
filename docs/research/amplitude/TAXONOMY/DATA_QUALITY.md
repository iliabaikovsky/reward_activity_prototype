# Data quality — EXD events (207818)

## Noise events (exclude from analysis)

Likely broken instrumentation — substring match on `exd` without proper snake_case:

| Event | Action |
|-------|--------|
| `exd 0`, `exd 8`, `exd 150`, `exd 200`, `exd 260`, `exd 980`, `exd 1020` | Exclude |
| `exd onload`, `exd onload: [object Window]` | Exclude |
| `exd resize`, `exd window[object Window]` | Exclude |
| `exd document[object HTMLDocument]`, `exd flagfalse` | Exclude |
| Bare `exd` | Review — may be legacy catch-all |

## Product events with empty description

Most `exd_*` events in Amplitude have **no description** in taxonomy. For AI/MCP analysis quality:

- Enrich descriptions in Amplitude Data when possible
- Mirror business meaning in [`EXD_EVENTS_CATALOG.md`](EXD_EVENTS_CATALOG.md)

## Known gaps vs CE-3142 prototype

| Prototype surface | Expected analytics | Status |
|-------------------|-------------------|--------|
| Reward detail modal (pack) | `exd_*_detail_opened` or row tap event | **Not found** — gap |
| Order drill-down in modal | `exd_order_detail_*` | **Not found** — gap |
| Activity row tap → modal | May be uninstrumented | **TBD** — property audit |
| Rewards tab explicit open | `rewards_tab_*` | **Not found** — use `tab_selected` + property |
| Entry source attribution | `source` / `entry_point` on first EXD touch | **TBD** — property audit |

## Next audit steps

1. `search` entityTypes `EVENT_PROPERTY` for top entry events
2. `query_dataset` group-by on `value_segment` for baseline volumes
3. Session replay sample on drop-off between `home_did_load` and first `exd_*`
