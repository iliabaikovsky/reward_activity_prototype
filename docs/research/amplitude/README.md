# Amplitude research — CE-3142 (Exness Rewards)

Living workspace для PM-аналитики поведения users в **Mobile Trader Area** вокруг EXD / Exness Rewards и Activity feed.

**Prototype:** CE-3142 mock в этом репо — [`REWARD_LIFECYCLE.md`](../../product/REWARD_LIFECYCLE.md) · [`TRANSACTIONS_CATALOG.md`](../../product/TRANSACTIONS_CATALOG.md)

## Связанные документы

| Документ | Содержание |
|----------|------------|
| [`CONNECTIVITY.md`](CONNECTIVITY.md) | Project ID, MCP checklist, data sources |
| [`TAXONOMY/EXD_EVENTS_CATALOG.md`](TAXONOMY/EXD_EVENTS_CATALOG.md) | Реестр `exd_*` events + map на экраны прототипа |
| [`SEGMENTS/CLIENT_GROUPS.md`](SEGMENTS/CLIENT_GROUPS.md) | 5 value segments, tier, pilots |
| [`JOURNEYS/ENTRY_PATHS.md`](JOURNEYS/ENTRY_PATHS.md) | Home → Rewards, cross-entry paths |
| [`JOURNEYS/REWARDS_FUNNELS.md`](JOURNEYS/REWARDS_FUNNELS.md) | Funnels внутри Rewards |
| [`METRICS/KPI_TREE.md`](METRICS/KPI_TREE.md) | Objectives → metrics → events |
| [`METRICS/QUESTIONS_BACKLOG.md`](METRICS/QUESTIONS_BACKLOG.md) | Гипотезы для analysis |
| [`analyses/2026-06-12_baseline-funnels.md`](analyses/2026-06-12_baseline-funnels.md) | **Baseline funnels L30D** (data-first) |

## Amplitude project

| | |
|--|--|
| **Name** | Mobile Trader Area |
| **Project ID** | `207818` |
| **URL** | [app.amplitude.com/.../207818](https://app.amplitude.com/analytics/exness/home/project/207818) |
| **Timezone** | UTC |

## Quick start (agent / PM)

1. MCP: `get_context` → `get_project_context(207818)`
2. Events: [`EXD_EVENTS_CATALOG.md`](TAXONOMY/EXD_EVENTS_CATALOG.md) — не угадывать имена
3. Segments: breakdown по `value_segment` (5 групп) — [`CLIENT_GROUPS.md`](SEGMENTS/CLIENT_GROUPS.md)
4. Analysis output → `analyses/YYYY-MM-DD_topic.md`
5. Charts → update [`CHART_INDEX.md`](links/CHART_INDEX.md)

Cursor skill: [`.cursor/skills/amplitude-research/SKILL.md`](../../../.cursor/skills/amplitude-research/SKILL.md)

Official plugin: [Amplitude MCP Marketplace](https://github.com/amplitude/mcp-marketplace)
