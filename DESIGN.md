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

- **Жизненный цикл EXD / Cashback и примеры с цифрами:** см. **`REWARD_LIFECYCLE.md`**
- **Платформа:** Web, мобильный вьюпорт **375px** (`max-width` в `.app-container`)
- **Экраны в этом прототипе:** **Exness Rewards** (полный экран по ноде): тёмный hero (статус Ultimate, прогресс EXD), карусель кошельков, How to earn, Upcoming, Lifetime cashback, Activity feed
- **Состояния:** клик по строке открывает bottom sheet. Для **Loyalty / Cashback** (пачки): сверху детали пачки, блок ордеров (как Figma `42104:17559`, `42104:17168`): строка **Last 3 orders** + chevron открывает второй sheet со **всем** списком; ниже превью **трёх** последних (тот же порядок, что в полном списке); клик по превью → сразу деталька ордера во втором sheet. Заголовок второго sheet по-прежнему **Orders**. **Назад** (chevron / backdrop / Escape). Остальные типы — только верхний уровень.
- **Не делать в v1:** реальный API, ассеты Figma по CDN (истекают ~7 дней) — в коде упрощённые иллюстрации

## Сверка с Figma (чеклист)

- **Иконки:** в макете — библиотека **Tabler** в связке с iOS-компонентами; в коде подключён `@tabler/icons-react` (stroke 2 / 1.75 как в UI-kit).
- **Кошельки:** горизонтальный скролл, карточки 327px, gap 8px; вертикальные отступы у ленты, чтобы **Shadow/MD** не обрезалась; у второй карточки тень с отрицательным spread (как в Figma).
- **Tier Linear:** дорожка 4px + заливка ~1% (Maintain Ultimate / Earn EXD).
- **Upcoming:** в макете заголовок **без** chevron «провалиться» — в прототипе `showChevron={false}`.
- **Вьюпорт:** рамка **375×812** (`device-frame`), скролл контента внутри, home indicator снизу рамки.

## Референсы

- Тикет: CE-3142
- См. `FIGMA_CURSOR.md` — для точной верстки включи **Figma MCP** и попроси агента сверить отступы/типографику по ноде `42104:10683`.

---

_После обновления макета в Figma поправь node-id и список экранов выше._
