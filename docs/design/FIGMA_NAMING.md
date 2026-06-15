# Именование экранов и компонентов в Figma (Cursor export)

Единая схема для страницы **Cursor figma** (`42433:17909`) и composite на **🧩 Components**.

Связано: [`FIGMA_FROM_PROTOTYPE.md`](FIGMA_FROM_PROTOTYPE.md), [`FIGMA_VISUAL_QA.md`](FIGMA_VISUAL_QA.md).

---

## 1. Путь экрана (frame)

Формат — **слева направо**: продукт → контекст списка/экрана → деталь → состояние.

```text
{Product} / {List or pack title} / {Detail title} -- {State}
```

| Сегмент | Правило | Примеры |
|---------|---------|---------|
| **Product** | Корневой продукт | `Exness Rewards`, `Activity feed` |
| **List or pack** | Заголовок агрегата или экрана-родителя | `Loyalty rewards`, `EXD cashback`, `Birthday gift` |
| **Detail title** | `navTitle` модалки / order detail | `Loyalty reward` (единственное число) |
| **State** | Chip / бизнес-состояние | `Upcoming`, `Activated`, `Credited`, `Completed` |

### Примеры экранов

| Прототип | Имя frame в Figma |
|----------|-----------------|
| Pack loyalty upcoming | `Exness Rewards / Loyalty rewards -- Upcoming` |
| Order detail loyalty upcoming | `Exness Rewards / Loyalty rewards / Loyalty reward -- Upcoming` |
| Simple gift | `Exness Rewards / Birthday gift -- Credited` |
| Cashback pack | `Exness Rewards / EXD cashback -- Upcoming` |
| Activity feed (full screen) | `Activity feed / All types` |

**Разделители:** ` / ` между уровнями пути; ` -- ` перед состоянием (двойной дефис + пробелы).

**Copy:** брать из `navTitle`, `chip.text`, `TRANSACTIONS_CATALOG` — не выдумывать.

---

## 2. Компоненты (composite)

Формат — **роль, не внешний вид** (Figma: name by function; slash = иерархия в Assets):

```text
{Product} / {Context} / {Part}
```

| Правило | Пример |
|---------|--------|
| Контекст = сценарий UI | `Transaction detail` (общий для gift / loyalty / cashback order detail) |
| Part = блок внутри сценария | `Summary` (icon + amount + status chip), не `Hero` |
| Не описывать цвет/размер | ❌ `blue-large-badge` · ✅ `Summary` |
| Внутренние слоты DS | префикс `_` если когда-то вынесем private sub-parts |

| Компонент | Имя | Node |
|-----------|-----|------|
| Summary блок модалки | `Exness Rewards / Transaction detail / Summary` | `42450:9311` |
| Celebration (gift) | `Exness Rewards / Transaction detail / Celebration` | — |
| KV-строка (если вынесем) | `Exness Rewards / Transaction detail / Field row` | — |

**Почему не `Hero`:** marketing-term; не переносится на gift/cashback; в коде ближе `DetailHero` → в Figma **Summary** (верхний summary block).

Не использовать префикс `Reward /` без продукта — только **`Exness Rewards / …`**.

---

## 3. Размер frame

| Правило | Значение |
|---------|----------|
| Ширина | **375** |
| Минимальная высота | **812** (как `.device-frame` в `styles.css`) |
| Home Indicator | `y = frame.height - 34` |

Контент sheet может не заполнять 812 — нижнее поле paper/scrim допустимо; **frame не короче 812**.

---

## 4. Откуда брать State и данные

| Уровень | Источник имени | Источник полей |
|---------|----------------|----------------|
| Pack | `PackConfig.navTitle` + `chip.text` | `PACK_CONFIG` / `buildLoyaltyModalPack` |
| Order detail | `OrderInPack.detail.navTitle` + `chip.text` | `orders[i].detail` для **активного шага симулятора** |
| Simple | `SimpleConfig.navTitle` + `chip.text` | `SIMPLE_CONFIG` |

Для скриншота-сверки: шаг симулятора + `docs/screenshots/` (см. [`FIGMA_VISUAL_QA.md`](FIGMA_VISUAL_QA.md)).

---

## 5. Внутренние слои (универсально)

§1–4 — **внешние** имена (frame path, composite).  
Внутри frame — те же принципы: **роль, не порядковый номер**.

Полное правило: [`FIGMA_FROM_PROTOTYPE.md`](FIGMA_FROM_PROTOTYPE.md) §1.7. Кратко:

- Wrapper frames/groups → `Content`, `Field list`, `Footer`, `Spacing`, …
- Primary block → `Summary` (instance composite) или имя composite
- Строка списка → `Row / {label}` при необходимости
- ❌ `Frame 1`, `Frame 4`, `Group 12` после export
- DS instances — имя компонента OK; переименовывать только для ясности handoff

Шаг **label** в MCP workflow — после override, до screenshot.

---

## 6. Антипаттерны имён

| ❌ | ✅ |
|----|-----|
| `Reward / Detail / Order — Loyalty Upcoming (Cursor)` | `Exness Rewards / Loyalty rewards / Loyalty reward -- Upcoming` |
| `Frame 1`, `Frame 4` внутри экрана | `Content`, `Field list`, `Row / Earned on` |
| `-`, пустое имя | Осмысленный путь / роль |
| Данные из чужого шага (`+15.27` из static pack) | Данные шага 9 (`+1.00 EXD`, `#9100821`) |
| `(Cursor)` в имени | Не нужен — всё на странице Cursor figma |
