# Дизайн

## Ссылка на Figma

- **File / макет:** [Reward activity update — CE-3142](https://www.figma.com/design/zjgmQn0VBkQOTQdhAHF8G0/Reward-activity-update---CE-3142?node-id=42104-10683)
- **Главный фрейм / страница:** Reward activity (экран списка активности)
- **Node ID (Rewards):** `42104:10683` (из URL `node-id=42104-10683`)
- **Node ID (Activity feed):** `42124:14876` — отдельный экран: back, заголовок, фильтры **Type** (All types / Rewards / Cashback / Transfers / Others) и **Date** (All time / Last 7 / 30 days / Jan 2026) через bottom sheet; группы по дате; **Lifetime cashback** на Rewards ведёт в ленту с фильтром **Cashback**.
- **Симулятор шагов (glass rail):** `42137:26421` — переключение стейтов: pill **Liquid Glass**, круглые кнопки со стрелками, центр «N. Название шага»; в прототипе реализовано в `LifecycleSimulatorPanel` + адаптив `<480px` (полноэкранная рамка + плавающий виджет).
- **Bottom sheet (детали транзакции):**
  - `42104:17559` — Loyalty rewards **Upcoming**
  - `42104:17588` — Loyalty rewards **Activated**
  - `42104:17168` — Cashback **Upcoming**
  - `42104:17387` — Cashback **Credited**

## Контекст для разработки

- **Жизненный цикл EXD / Cashback и примеры с цифрами:** см. [`REWARD_LIFECYCLE.md`](../product/REWARD_LIFECYCLE.md)
- **Платформа:** Web, мобильный вьюпорт **375px** (`max-width` в `.app-container`)
- **Экраны в этом прототипе:** **Exness Rewards** (полный экран по ноде): тёмный hero (статус Ultimate, прогресс EXD), карусель кошельков, How to earn, Upcoming, Lifetime cashback, Activity feed
- **Состояния:** клик по строке открывает **iOS modal sheet** (`ModalSheet`: scrim, grabber, slide-up). **BottomSheet** (фильтры Activity) — medium detent; **RewardDetailModal** — **large** (96%) на всех шагах (pack / Orders / detail), без скачка высоты при push. Внутренняя навигация push/pop; **Last orders** + **See all**; Back без X на nested. Закрытие (X / backdrop) — только с корня pack.
- **Rewards screen:** между секциями (низ контента → заголовок следующей) **40px** (`--section-stack-gap`), без spacer-div.
- **Не делать в v1:** реальный API, ассеты Figma по CDN (истекают ~7 дней) — в коде упрощённые иллюстрации

## Сверка с Figma (чеклист)

- **Иконки:** в макете — библиотека **Tabler** в связке с iOS-компонентами; в коде подключён `@tabler/icons-react` (stroke 2 / 1.75 как в UI-kit).
- **Кошельки:** горизонтальный скролл, карточки 327px, gap 8px; вертикальные отступы у ленты, чтобы **Shadow/MD** не обрезалась; у второй карточки тень с отрицательным spread (как в Figma).
- **Tier Linear:** дорожка 4px + заливка ~1% (Maintain Ultimate / Earn EXD).
- **Rewards home — `How to earn rewards`:** заголовок секции **без** chevron (`SectionTitle` + `showChevron={false}`); баннер «Trade and level up» — клик → `EarnRewardsModal` (`43730:1106`); не путать с **Lifetime cashback** / **Activity feed** (chevron + drill).
- **Upcoming:** в макете заголовок **без** chevron «провалиться» — в прототипе `showChevron={false}`.
- **Вьюпорт:** рамка **375×812** (`device-frame`), скролл контента внутри, home indicator снизу рамки.

## Node-id → компонент

| Figma node | Компонент / файл | Примечание |
|------------|------------------|------------|
| `42104:10683` | `ExnessRewardsScreen` | `data-node-id` на корне экрана |
| `42124:14876` | `ActivityFeedScreen` | Фильтры Type / Date, группы по дате |
| `42137:26421` | `LifecycleSimulatorPanel` | Glass rail, шаги 1–10 |
| `42104:17559` | `RewardDetailModal` — `loyalty-upcoming` | Pack + Last 3 orders |
| `42104:17588` | `RewardDetailModal` — `loyalty-activated` | После activation |
| `42104:17168` | `RewardDetailModal` — `cashback-upcoming` | Cashback pending |
| `42104:17387` | `RewardDetailModal` — `cashback-activated` | Cashback credited |
| `43728:21233` | `ExnessRewardsPromoModal` | Promo landing (Info on Rewards) · Figma CE-3142 |
| `43730:1106` | `EarnRewardsModal` | How to earn — banner «Trade and level up» on Rewards home |
| `42579:350` | `Exness Rewards / Loyalty rewards -- Upcoming` | **Cursor figma** · pack modal (step 2 drill) · [`FIGMA_NAMING.md`](FIGMA_NAMING.md) |
| `42507:155` | `Exness Rewards / Loyalty rewards / Loyalty reward -- Upcoming` | **Cursor figma** · order detail nested route |
| `42450:9311` | `Exness Rewards / Transaction detail / Summary` | **🧩 Components** — primary block (icon + amount + chip) |
| `42421:16687` | Designer — Birthday gift (Simple) | Gift celebration block |
| `42413:32765` | Designer — order detail (full) | Не копировать Earning rate / Calculation в stripped export |
| — | `TransactionRow` | Строки Upcoming / preview / feed |
| — | `ModalSheet` | iOS HIG sheet shell (scrim, grabber, detents) |
| — | `BottomSheet` | Filter sheets (Type, Date) → `ModalSheet` medium |
| — | `MobileScreenShell` | Status bar, nav, bottom safe area |

Конфиги модалок: `src/components/reward/RewardDetailModal/configs/`. Динамический loyalty pack: `buildLoyaltyModalPack.ts`.

## Референсы

- Тикет: CE-3142
- См. [`FIGMA_CURSOR.md`](FIGMA_CURSOR.md) — для точной верстки включи **Figma MCP** и попроси агента сверить отступы/типографику по ноде `42104:10683`.

---

_После обновления макета в Figma поправь node-id и список экранов выше._
