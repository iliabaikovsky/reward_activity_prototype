# Amplitude connectivity — Mobile Trader Area (207818)

Последняя проверка: **12 Jun 2026** (MCP `user-amplitude`).

## Project

| Field | Value |
|-------|-------|
| Project name | Mobile Trader Area |
| Project ID (`appId`) | `207818` |
| Org | Exness Global Inc. (`47079`) |
| Session timeout | 30 minutes |
| Timezone | UTC |

## MCP checklist

| Step | Tool | Status |
|------|------|--------|
| Org + projects list | `get_context` | OK |
| Project settings | `get_project_context(207818)` | OK |
| Data ingestion | `get_data_ingestion_sources(207818)` | OK — iOS/Android CONNECTED |
| Event discovery | `search` (entityTypes: EVENT) | OK — ~80 `exd_*` product events |
| Segment discovery | `search` (USER_PROPERTY, COHORT) | OK — `value_segment`, pilot cohorts |
| Event properties | `get_event_properties` | **Not exposed** in current MCP tool list — use `search` (EVENT_PROPERTY) or `query_dataset` |
| Baseline charts | `query_chart` / `create_chart` | Pending (next task) |

## Data sources (30d volume, CONNECTED)

| Source | Approx. volume |
|--------|----------------|
| Android SDK | ~488M events |
| iOS SDK | ~273M events |
| HTTP API | ~246M events |
| React Native SDK | ~10M events |
| AppsFlyer | ~297K events |

## Naming conventions (org-level)

From Amplitude `org.aiContext`:

- Event names: **snake_case**, syntax **`object_action`**
- Property names: **snake_case**
- No dynamic event names (use properties for variants)

## Re-verify

```text
1. get_context — projects include 207818
2. get_data_ingestion_sources(207818) — SDK_IOS / SDK_ANDROID status CONNECTED
3. search queries=["exd_rewards"] entityTypes=["EVENT"] appIds=[207818]
```
