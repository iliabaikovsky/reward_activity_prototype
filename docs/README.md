# Документация CE-3142

Точка входа — [`README.md`](../README.md) в корне репозитория.

## Структура

| Папка | Содержание |
|-------|------------|
| [`product/`](product/) | Каталог транзакций, lifecycle, copy drill-in |
| [`research/`](research/) | Fintech UX benchmark (Mobbin), gap analysis, earning rate explainer, **Amplitude analytics (CE-3142)** |
| [`architecture/`](architecture/) | Поток данных, рефакторинг, UX map |
| [`design/`](design/) | Figma, FIGMA_CURSOR, чеклисты, spread rebate design |
| [`deploy/`](deploy/) | Vercel, Basic Auth |
| [`specs/`](specs/) | Spread rebate: task, prototype spec, варианты |

## Часто используемые

- [`product/TRANSACTIONS_CATALOG.md`](product/TRANSACTIONS_CATALOG.md) — Kind ID, поля list/modal/order
- [`product/REWARD_LIFECYCLE.md`](product/REWARD_LIFECYCLE.md) — 9 шагов симулятора, цифры моков
- [`product/EXD_EARNING_MATH.md`](product/EXD_EARNING_MATH.md) — формула EXD за сделку (loyalty)
- [`research/EARNING_RATE_EXPLAINER_UX.md`](research/EARNING_RATE_EXPLAINER_UX.md) — Earning rate sheet v1 (Mobbin + copy)
- [`research/amplitude/README.md`](research/amplitude/README.md) — Amplitude research workspace (EXD events, segments, funnels)
- [`research/REWARD_CALCULATION_UX.md`](research/REWARD_CALCULATION_UX.md) — How EXD were calculated (entry + breakdown sheet)
- [`research/USABILITY_TEST_LIFECYCLE.md`](research/USABILITY_TEST_LIFECYCLE.md) — Unmoderated UserTesting script (7-chapter lifecycle)
- [`research/USABILITY_TEST_QUESTIONS.md`](research/USABILITY_TEST_QUESTIONS.md) — Participant questions by chapter (editable copy)
- [`architecture/ARCHITECTURE.md`](architecture/ARCHITECTURE.md) — модули и regression checklist
- [`design/DESIGN.md`](design/DESIGN.md) — Figma node-id
- [`design/SCREENSHOT_CATALOG.md`](design/SCREENSHOT_CATALOG.md) — реестр PNG для QA / Figma export (`npm run screenshots`)

Правило для агента: [`.cursor/rules/docs-structure.mdc`](../.cursor/rules/docs-structure.mdc).
