---
name: amplitude-research
description: Run CE-3142 product analytics research in Amplitude (Mobile Trader Area 207818) — exd events, value_segment breakdowns, entry funnels, insight memos.
---

# Amplitude research (CE-3142)

Use when the user asks for Amplitude analysis, EXD metrics, user behavior in Mobile Trader, value segments, entry paths, or Rewards/Activity funnel insights.

## Before any query

1. Read [`docs/research/amplitude/README.md`](../../docs/research/amplitude/README.md)
2. MCP: `get_context` → `get_project_context` with **`projectId: 207818`** (Mobile Trader Area only unless user says otherwise)
3. Events: [`EXD_EVENTS_CATALOG.md`](../../docs/research/amplitude/TAXONOMY/EXD_EVENTS_CATALOG.md) — never guess names
4. Exclude noise: [`DATA_QUALITY.md`](../../docs/research/amplitude/TAXONOMY/DATA_QUALITY.md)
5. Segments: breakdown by **`value_segment`** (5 client groups) — [`CLIENT_GROUPS.md`](../../docs/research/amplitude/SEGMENTS/CLIENT_GROUPS.md)

## MCP workflow

```text
get_context → get_project_context(207818)
search (EVENT / EVENT_PROPERTY / COHORT) — limit 100–200 for taxonomy
query_chart / create_chart — prefer visual answers
compare-user-journeys — segment comparisons (marketplace skill)
```

If `get_event_properties` unavailable, use `search` with `entityTypes: ["EVENT_PROPERTY"]` or `query_dataset`.

## Analysis output

**Data first:** run funnels/metrics → write `analyses/YYYY-MM-DD_*.md` with **numbers only** → interpretations in separate discussion, not in the same pass.

1. Raw data → `docs/research/amplitude/analyses/YYYY-MM-DD_short_topic.md`
2. Structure: **Period → Method → Tables → Data gaps** (no hypotheses until user asks)
3. Update [`CHART_INDEX.md`](../../docs/research/amplitude/links/CHART_INDEX.md)
4. [`QUESTIONS_BACKLOG.md`](../../docs/research/amplitude/METRICS/QUESTIONS_BACKLOG.md) — only after baseline exists

## Key funnels

- **Entry:** [`ENTRY_PATHS.md`](../../docs/research/amplitude/JOURNEYS/ENTRY_PATHS.md) — `home_did_load` → entry → `exd_total_value_shown`
- **In-product:** [`REWARDS_FUNNELS.md`](../../docs/research/amplitude/JOURNEYS/REWARDS_FUNNELS.md)

## Cross-links

- Prototype lifecycle: [`docs/product/REWARD_LIFECYCLE.md`](../../docs/product/REWARD_LIFECYCLE.md)
- Transaction types: [`docs/product/TRANSACTIONS_CATALOG.md`](../../docs/product/TRANSACTIONS_CATALOG.md)
- CE-3142 Upcoming USD rule: `.cursor/rules/clarify-before-implementing.mdc`

## Official Amplitude skills (install plugin)

From [Amplitude MCP Marketplace](https://github.com/amplitude/mcp-marketplace): `taxonomy`, `compare-user-journeys`, `analyze-dashboard`, `create-chart`, `discover-opportunities`, `replay-ux-audit`.

## Do not

- Use PostHog patterns from `adding-analytics` for this project’s production data
- Mix pilot cohorts with value_segment without labeling
- Include noise events (`exd onload`, etc.) in funnels
