# Exness Rewards — reward activity prototype (CE-3142)

Интерактивный мобильный прототип **Exness Rewards** и **Activity feed**: кошельки EXD, tier progress, Upcoming, bottom sheets с деталями транзакций, симулятор жизненного цикла EXD/Cashback на 9 шагов.

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
| **Lifecycle simulator** | 9 шагов mock-сценария из [`docs/product/REWARD_LIFECYCLE.md`](docs/product/REWARD_LIFECYCLE.md) |

## Документация

Полный индекс: [`docs/README.md`](docs/README.md).

| Документ | Содержание |
|----------|------------|
| [`docs/architecture/ARCHITECTURE.md`](docs/architecture/ARCHITECTURE.md) | Поток данных, слои, regression checklist |
| [`docs/architecture/REFACTORING.md`](docs/architecture/REFACTORING.md) | Структура после рефакторинга, антипаттерны |
| [`docs/product/REWARD_LIFECYCLE.md`](docs/product/REWARD_LIFECYCLE.md) | Бизнес-сценарий EXD/Cashback и цифры для моков |
| [`docs/product/TRANSACTIONS_CATALOG.md`](docs/product/TRANSACTIONS_CATALOG.md) | Каталог типов транзакций и полей детализации |
| [`docs/design/DESIGN.md`](docs/design/DESIGN.md) | Figma node-id → компоненты, чеклист сверки |
| [`docs/deploy/DEPLOY.md`](docs/deploy/DEPLOY.md) | Vercel, Basic Auth |
| [`docs/design/FIGMA_CURSOR.md`](docs/design/FIGMA_CURSOR.md) | Figma MCP и агент в Cursor |

Cursor rules: [`.cursor/rules/reward-prototype-refactor.mdc`](.cursor/rules/reward-prototype-refactor.mdc) · [`.cursor/rules/docs-structure.mdc`](.cursor/rules/docs-structure.mdc).

## Figma

Макет: [Reward activity update — CE-3142](https://www.figma.com/design/zjgmQn0VBkQOTQdhAHF8G0/Reward-activity-update---CE-3142?node-id=42104-10683) — подробности в [`docs/design/DESIGN.md`](docs/design/DESIGN.md).

## Деплой

См. [`docs/deploy/DEPLOY.md`](docs/deploy/DEPLOY.md): Git push → Vercel или `npm run deploy` после `npx vercel login`.

---

Этот репозиторий — **продуктовый прототип CE-3142**, не generic шаблон. Для форка «пустого» Figma → Vercel шаблона см. [`docs/design/COPY_CHECKLIST.md`](docs/design/COPY_CHECKLIST.md).
