# Architecture — reward activity prototype

Интерактивный прототип **Exness Rewards** (CE-3142): два экрана, bottom sheets, симулятор жизненного цикла EXD/Cashback.

## Поток данных

```text
LifecycleSimulatorPanel
        │
        ▼
  lifecycleSteps.ts  ──► LifecycleStep (simulatorTodayIso, available, upcoming, feedGroups, …)
        │
        ▼
      App.tsx  ── route: rewards | activity
        │         demoTodayIso = lifecycle.simulatorTodayIso
        │
        ├── ExnessRewardsScreen
        │         drill-in Upcoming ← lifecycle.upcoming[]
        │         onOpenActivityFeed / onOpenRewardModal
        │
        ├── ActivityFeedScreen
        │         filters (type, date) → activityFeedFilter.ts (todayIso per step)
        │
        └── RewardDetailModal
                  variant + packOverride (buildLoyaltyModalPack.ts)
```

## Ключевые модули

| Путь | Назначение |
|------|------------|
| [`src/App.tsx`](../../src/App.tsx) | Маршрутизация, state симулятора, модалка |
| [`src/screens/ExnessRewardsScreen.tsx`](../../src/screens/ExnessRewardsScreen.tsx) | Главный экран Rewards |
| [`src/screens/ActivityFeedScreen.tsx`](../../src/screens/ActivityFeedScreen.tsx) | Полная лента с фильтрами |
| [`src/components/reward/RewardDetailModal/`](../../src/components/reward/RewardDetailModal/) | Bottom sheet деталей |
| [`src/rewardLifecycle/lifecycleSteps.ts`](../../src/rewardLifecycle/lifecycleSteps.ts) | 9 шагов симулятора + mock data |
| [`src/rewardLifecycle/demoTimeline.ts`](../../src/rewardLifecycle/demoTimeline.ts) | Якорная дата, per-step today, периоды loyalty |
| [`src/rewardLifecycle/buildLoyaltyModalPack.ts`](../../src/rewardLifecycle/buildLoyaltyModalPack.ts) | Синхронизация modal pack ↔ симулятор |
| [`src/context/DeviceFrameContext.tsx`](../../src/context/DeviceFrameContext.tsx) | Portal bottom sheets в рамку 375×812 |

## Симулятор

- Панель: [`LifecycleSimulatorPanel.tsx`](../../src/rewardLifecycle/LifecycleSimulatorPanel.tsx)
- Старт: шаг 1 «Новый пользователь» (§0 в [`REWARD_LIFECYCLE.md`](../product/REWARD_LIFECYCLE.md))
- На каждом шаге обновляются: кошельки, Upcoming, превью ленты, полная лента

## Слои (после рефакторинга)

| Путь | Назначение |
|------|------------|
| [`src/domain/reward/`](../../src/domain/reward/) | Типы, `parseExd`, feature flags, adapters → `TransactionRowModel` |
| [`src/components/ui/`](../../src/components/ui/) | Shared UI: `TransactionRow`, `SectionHeader`, `BottomSheet`, … |
| [`src/components/reward/RewardDetailModal/`](../../src/components/reward/RewardDetailModal/) | Modal: `configs/`, `parts/` |
| [`src/screens/`](../../src/screens/) | Композиция экранов (hero tier — только в `ExnessRewardsScreen`) |
| [`src/rewardLifecycle/`](../../src/rewardLifecycle/) | Симулятор: steps, feed groups, loyalty pack builder |

Как добавлять типы транзакций, modal variants и шаги симулятора — [`REFACTORING.md`](REFACTORING.md) и Cursor rule [`.cursor/rules/reward-prototype-refactor.mdc`](../../.cursor/rules/reward-prototype-refactor.mdc).

## Документация

| Файл | Содержание |
|------|------------|
| [`REFACTORING.md`](REFACTORING.md) | Структура, чеклисты, антипаттерны |
| [`DESIGN.md`](../design/DESIGN.md) | Figma node-id → компоненты, чеклист сверки |
| [`REWARD_LIFECYCLE.md`](../product/REWARD_LIFECYCLE.md) | Бизнес-сценарий и цифры для моков |
| [`TRANSACTIONS_CATALOG.md`](../product/TRANSACTIONS_CATALOG.md) | Каталог типов транзакций, агрегаций и полей детализации (list → modal → order) |
| [`DEPLOY.md`](../deploy/DEPLOY.md) | Vercel, Basic Auth |

## Regression checklist

1. Симулятор: шаги 1→9, Назад/Далее
2. Rewards: wallets, tier progress, Upcoming/Activity preview → modal
3. Lifetime cashback → Activity feed (filter Cashback)
4. Activity feed: Type + Date filters
5. Modals: все variants, orders navigation
6. Mobile `<480px`: lifecycle rail не перекрывает контент
7. `npm run build` без ошибок
