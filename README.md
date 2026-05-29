# Exness Rewards — reward activity prototype (CE-3142)

Интерактивный мобильный прототип **Exness Rewards** и **Activity feed**: кошельки EXD, tier progress, Upcoming, bottom sheets с деталями транзакций, симулятор жизненного цикла EXD/Cashback на 10 шагов.

Стек: **React 18**, **TypeScript**, **Vite 6**, деплой на **Vercel**.

## Быстрый старт

```bash
npm install
npm run dev
npm run build   # перед деплоем
```

Откройте локально, переключайте шаги симулятора (glass rail справа) и проверяйте экраны Rewards и Activity feed.

## Что внутри

| Область | Описание |
|---------|----------|
| **Exness Rewards** | Hero tier, кошельки, Upcoming, Lifetime cashback, превью ленты |
| **Activity feed** | Полная лента, фильтры Type / Date (bottom sheet) |
| **RewardDetailModal** | Детали loyalty/cashback packs, orders drill-down |
| **Lifecycle simulator** | 10 шагов mock-сценария из `REWARD_LIFECYCLE.md` |

## Документация

| Файл | Содержание |
|------|------------|
| [`ARCHITECTURE.md`](ARCHITECTURE.md) | Поток данных, слои, regression checklist |
| [`REFACTORING.md`](REFACTORING.md) | Структура после рефакторинга, антипаттерны |
| [`REWARD_LIFECYCLE.md`](REWARD_LIFECYCLE.md) | Бизнес-сценарий EXD/Cashback и цифры для моков |
| [`DESIGN.md`](DESIGN.md) | Figma node-id → компоненты, чеклист сверки |
| [`DEPLOY.md`](DEPLOY.md) | Vercel, Basic Auth |
| [`FIGMA_CURSOR.md`](FIGMA_CURSOR.md) | Figma MCP и агент в Cursor |

Cursor rule для структуры кода: [`.cursor/rules/reward-prototype-refactor.mdc`](.cursor/rules/reward-prototype-refactor.mdc).

## Figma

Макет: [Reward activity update — CE-3142](https://www.figma.com/design/zjgmQn0VBkQOTQdhAHF8G0/Reward-activity-update---CE-3142?node-id=42104-10683) — подробности в **`DESIGN.md`**.

## Деплой

См. **`DEPLOY.md`**: Git push → Vercel или `npm run deploy` после `npx vercel login`.

---

Этот репозиторий — **продуктовый прототип CE-3142**, не generic шаблон. Для форка «пустого» Figma → Vercel шаблона см. заметку в [`COPY_CHECKLIST.md`](COPY_CHECKLIST.md).
