# Refactoring guide

Краткий справочник по структуре прототипа. Cursor rule (always apply): [`.cursor/rules/reward-prototype-refactor.mdc`](../../.cursor/rules/reward-prototype-refactor.mdc).

## Быстрая карта

```text
domain/reward/     types, parseExd, featureFlags, transactionAdapters
components/ui/     TransactionRow, SectionHeader, BottomSheet, MobileScreenShell, RewardEventIcon
components/reward/ RewardDetailModal/{configs,parts}
screens/           ExnessRewardsScreen, ActivityFeedScreen (+ filter helpers)
rewardLifecycle/   lifecycleSteps, feedGroupsData, buildLoyaltyModalPack
```

## Anti-patterns / не повторять

> **Главное правило:** если паттерн уже есть в `components/ui/` или `domain/reward/` — **импортируй**, не копируй. Ниже — конкретные косяки, которые уже стоили рефакторинга.

### 1. Дублирование icon switch

- **❌ Плохо:** `RowIcon`, `RowIconTabler`, `HeroIconEl` — три `switch (icon)` в разных файлах.
- **✅ Хорошо:** один `RewardEventIcon` (`components/ui/RewardEventIcon.tsx`); union `RewardEventIcon` в `domain/reward/types.ts`.
- **Проверь:** grep `switch.*icon` / `IconGift` в screens и modal — должны вести только в `RewardEventIcon`.

### 2. Дублирование разметки строки

- **❌ Плохо:** `FeedRow` в Activity feed и отдельная разметка upcoming/preview в Rewards screen.
- **✅ Хорошо:** `TransactionRow` + `transactionAdapters.ts` (`fromActivityFeedItem`, `fromUpcomingItem`, `fromActivityPreview`).
- **Проверь:** в screen нет `<div className={styles.row}>` для транзакций — только `<TransactionRow model={…} />`.

### 3. Дублирование mobile shell CSS

- **❌ Плохо:** копировать `.statusBar`, `.topNav`, `.bottomSafe` в каждый screen module.
- **✅ Хорошо:** `MobileScreenShell` — status bar, nav slot, safe area один раз.
- **Проверь:** новый экран оборачивается в shell; screen CSS — только контент внутри.

### 4. Самодельный bottom sheet

- **❌ Плохо:** свой portal, `document.body.style.overflow`, Escape handler, backdrop в screen.
- **✅ Хорошо:** `BottomSheet` + `useBottomSheet` (`components/ui/`).
- **Проверь:** filter sheet и modal overlay не reimplement scroll-lock/portal.

### 5. Mock data внутри UI

- **❌ Плохо:** `PACK_CONFIG` на 500+ строк в `RewardDetailModal.tsx`.
- **✅ Хорошо:** static configs в `RewardDetailModal/configs/`; dynamic loyalty pack — `buildLoyaltyModalPack.ts`.
- **Проверь:** `.tsx` модалки — только рендер; большие объекты — в `configs/` или `rewardLifecycle/`.

### 6. Feature flags по screens

- **❌ Плохо:** `const HIDE_EARN_BANNER = true` локально в screen.
- **✅ Хорошо:** `domain/reward/featureFlags.ts` — все `HIDE_*`; скрытие CSS-классом, элемент в DOM.
- **Проверь:** grep `HIDE_` — только `featureFlags.ts` + import в компонентах.

### 7. parseExd в компонентах

- **❌ Плохо:** `parseFloat(exd.replace(' EXD', ''))` inline в screen/modal.
- **✅ Хорошо:** `parseExd` / форматирование в `domain/reward/parseExd.ts`.
- **Проверь:** domain без React; screens не парсят строки EXD сами.

### 8. Разрозненные типы иконок

- **❌ Плохо:** `LifecycleActivityIcon`, отдельный icon type в feed model, третий в modal.
- **✅ Хорошо:** один `RewardEventIcon` в `domain/reward/types.ts`; adapters приводят source → `TransactionRowModel`.
- **Проверь:** новый icon type — расширение union в `types.ts`, не локальный type alias.

### 9. UI-хелперы в screens

- **❌ Плохо:** `function SectionTitle()`, `FilterChip()` внутри `ActivityFeedScreen.tsx`, если паттерн общий.
- **✅ Хорошо:** переиспользуемое → `components/ui/`; уникальное для Rewards (tier hero, wallets) → остаётся в screen.
- **Проверь:** 2+ использования или тот же паттерн на обоих экранах → extract в ui.

### 10. Сломанные импорты после move

- **❌ Плохо:** `import … from '../RewardDetailModal'` после переноса в подпапку без barrel.
- **✅ Хорошо:** barrel `index.ts`; обновить все imports; `npm run build`.
- **Проверь:** после rename/move — build + grep старых путей.

### 11. Generic README вместо продукта

- **❌ Плохо:** README «шаблон Figma → Vercel» без упоминания Exness Rewards / CE-3142.
- **✅ Хорошо:** README описывает этот прототип; архитектура — `docs/architecture/ARCHITECTURE.md`, сценарий — `docs/product/REWARD_LIFECYCLE.md`.
- **Проверь:** новый разработчик понимает продукт из README, не только «как скопировать шаблон».

### Прочее — не делать

- Новые npm-зависимости без явного запроса.
- Generic modal registry / factory для 8 variants — plain objects в configs достаточно.
- Hero tier block из `ExnessRewardsScreen` в shared UI.
- React в `domain/`, mock data в `screens/`, правки `.cursor/plans/`.

---

## Когда выносить UI

| Ситуация | Куда |
|----------|------|
| Строка списка на Rewards и Activity feed | `TransactionRow` + adapter |
| Заголовок «Upcoming» / «Activity feed» | `SectionHeader` |
| Status bar, nav, safe area | `MobileScreenShell` |
| Filter sheet на Activity feed | `BottomSheet` |
| Tier hero, wallets, banner | **остаётся** в `ExnessRewardsScreen` |

## Типичные задачи

### Новая строка в ленте

1. Item в `feedGroupsData.ts` (или inline в шаге, если одноразовый).
2. `rewardModal` → существующий или новый variant.
3. Подключить группу в `lifecycleSteps.ts` для нужных шагов.

### Новая модалка

1. `rewardModalTypes.ts` — добавить variant.
2. Static: `simpleConfigs.ts` или `packConfigs.ts`.
3. Dynamic loyalty pack: `buildLoyaltyModalPack.ts`.

### Новый шаг симулятора

1. Запись в `LIFECYCLE_STEPS`.
2. Сверка с [`REWARD_LIFECYCLE.md`](../product/REWARD_LIFECYCLE.md).

### Скрыть UI временно

`domain/reward/featureFlags.ts` + CSS class hidden в компоненте.

## После изменений

```bash
npm run build
```

Regression — см. checklist в [`ARCHITECTURE.md`](ARCHITECTURE.md#regression-checklist).

### Git (после крупных правок — обязательно)

Рефакторинг, новый экран, перенос модулей, >5 файлов → `git add` → commit → `git push origin`, если пользователь не просил обратного. См. `.cursor/rules/reward-prototype-refactor.mdc`.

Быстрый anti-pattern grep:

```bash
rg "switch.*icon|HIDE_.*=.*true|parseFloat.*EXD" src/screens src/components/reward --glob '!**/configs/**'
```
