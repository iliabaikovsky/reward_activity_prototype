# Visual QA: прототип ↔ Figma

Универсальная сверка **по категориям UI**, не по именам DS-компонентов. Имена lib — в [`FIGMA_FROM_PROTOTYPE.md`](FIGMA_FROM_PROTOTYPE.md) приложение A.

**Эталон:** скриншоты прототипа + живой dev. **Export:** agent canvas page проекта.

---

## 0. TRACE (обязательный порядок)

1. **T**arget — state: шаг симулятора, variant, route (root / nested).
2. **R**eference — скриншот прототипа (`docs/screenshots/`) + код + CSS.
3. **A**ssemble — INVENTORY → instance composites → DS для остального ([`FIGMA_FROM_PROTOTYPE.md` §2](FIGMA_FROM_PROTOTYPE.md#2-workflow-mcp-универсальный)).
4. **C**ompare — **incremental + full VISUAL gates** [`FIGMA_FROM_PROTOTYPE.md` §1.10](FIGMA_FROM_PROTOTYPE.md#110-post-export-gate--визуальный-скриншот-figma-обязательно):

| Step | Gate | Категории | Блокер |
|------|------|-----------|--------|
| после Summary | **Gate-F** | F (icon, amount, chip построчно) | FAIL → не собирать rows |
| после field list | **Gate-GH** | G (каждая row), H (divider, chevron, badge) | placeholder = FAIL |
| перед ответом | **Gate-full** | A–K | полная таблица в ответе |

   - **растровый** скрин: `get_screenshot` MCP и/или `frame.screenshot()`;
   - скрин пользователя = Gate-full немедленно;
   - side-by-side с `docs/screenshots/`;
   - таблица: категория · прототип · **Figma visual** · статус.

5. **E**scalate — не-OK → fix → **новый скрин** нужного gate; readback OK + скрин FAIL → [RENDER §1.11](FIGMA_FROM_PROTOTYPE.md#111-render--readback--canvas-универсальный-сбой); **Ask** → стоп; находка → §4 + §D **сразу**.

**Агент не закрывает задачу без Gate-full.** `characters` — отладка, не приёмка.

---

## 1. Универсальные категории элементов

Сверять **роль в UI**, не «TableView Cell строка 3». Одна категория может мапиться на разные DS в других проектах.

| # | Категория | Что проверять | Откуда в прототипе |
|---|-----------|---------------|-------------------|
| A | **Canvas** | размер frame, имя, placement page | device shell / viewport |
| B | **Overlay** | scrim, sheet shape, grabber | modal shell CSS |
| C | **System chrome** | status bar, safe area | device vs in-sheet — **Ask** если расхождение |
| D | **Header actions** | start action (back/close/menu), end actions | nav component + **route depth** |
| E | **Header title** | copy, alignment — **INK** если instance | `navTitle` / route config |
| F | **Primary block** | icon, amount, status chip — **INK** §1.8, не placeholder `Title` | hero / summary section |
| G | **Field list** | label/value pairs, count, order — **INK** на cell instances | row configs / adapters |
| H | **Row chrome** | dividers, trailing icon, nested badge | per-row flags + CSS |
| I | **Ornaments** | home indicator, footer spacing | device frame bottom |
| J | **Hygiene** | нет hidden наследия, нет лишних секций | layer tree после clone |
| K | **Layer names** | wrappers по роли, не `Frame N` / `Group N` | [`FIGMA_FROM_PROTOTYPE.md` §1.7](FIGMA_FROM_PROTOTYPE.md#17-semantic-layer-tree) |

### Как читать категорию D (header actions)

| Route depth | Ожидание в прототипе | Типичный fix в DS |
|-------------|----------------------|-------------------|
| Root / dismiss | close (X) | start slot → close icon |
| Nested / drill-down | back (chevron) | SLOT: boolean on start slot + **swap** default close child |

Не заучивать layer names — **inspect** start slot под nav instance ([SLOT §1.5](FIGMA_FROM_PROTOTYPE.md#15-slot--props-и-слоты)).

### Как читать категорию H (row chrome)

| Сигнал в коде/CSS | Ожидание |
|-------------------|----------|
| Нет border между rows | divider prop off или нет separator layer |
| `chevron: false` / нет в adapter | нет trailing chevron |
| Chip/badge в value | правильный variant + copy, не placeholder |

### Как читать категорию K (layer names)

`get_metadata` / layers panel: нет дефолтных `Frame 1`, `Frame 4` на **agent-owned** wrappers.

| Роль | Ожидаемое имя |
|------|----------------|
| Stack под shell | `Content` |
| Hero / summary instance | `Hero` или composite name |
| Блок KV-строк | `Field list` |
| Строка | `Row / {label}` или DS cell name |

Проверять **после** assemble, вместе с категорией J.

---

## 2. Discovery: прототип → DS (не заучивание)

Для **каждой** категории из §1:

1. Найти элемент в **DOM / screenshot** (роль, не class name как конец).
2. `search_design_system` по роли («list row», «navigation bar», «badge»).
3. `get_metadata` + `componentProperties` на выбранном instance.
4. Если визуал не совпал — **SLOT** ([`FIGMA_FROM_PROTOTYPE.md` §1.5](FIGMA_FROM_PROTOTYPE.md#15-slot--props-и-слоты)).
5. Screenshot одного элемента / всего frame.

**Не** копировать checklist конкретных prop id из старых export — id могут отличаться; тип prop (boolean / swap) важнее.

---

## 3. CE-3142 — кейс-стади

Пример применения §1 к одному экрану. Новые экраны — своя секция по тому же шаблону.

### Order detail — Upcoming (nested route)

**Прототип:** `docs/screenshots/modals-pack/loyalty-upcoming-order-detail.png`  
**State:** активный шаг симулятора · nested `orderDetail` · row config из кода.

**Урок сессии (универсальный):** после INK plugin readback показывал верные значения; **растровый** `get_screenshot` и canvas пользователя — reference copy (`+1.12`, placeholder `Title`, неверный order/booster). Gate = **visual FAIL** → [RENDER §1.11](FIGMA_FROM_PROTOTYPE.md#111-render--readback--canvas-универсальный-сбой).

| Кат. | Прототип | Figma visual (gate) | Статус |
|------|----------|---------------------|--------|
| A | device frame | 375×812 | OK |
| D | back affordance (nested) | chevron | OK |
| E | nav title | Loyalty reward | OK |
| F | amount + status chip | reference / placeholder на скрине | **FAIL** — RENDER |
| G | KV list | placeholders / неверные values на скрине | **FAIL** — dual end slot + clone |
| H | row chrome (divider, chevron) | chevron на order в visual | **FAIL** |
| J | no hidden junk | stripped in tree | Partial |
| K | semantic wrappers | Content, Field list, Summary | OK |
| C | system chrome placement | status in sheet | **Open** — Ask design |

---

## 4. Журнал кейсов

| Дата | Frame | Итог |
|------|-------|------|
| 2026-06-10 | `42436:9311` | Первая TRACE-матрица; universal categories + CE-3142 case |
| 2026-06-10 | `42472:207` | Rebuild на Cursor figma; Summary composite; SLOT/INK/label |
| 2026-06-10 | `42493:94` | **RENDER:** readback OK, visual FAIL; gate только по скрину; user canvas = truth |
| 2026-06-11 | `42507:155` | INVENTORY rebuild; REHYDRATE без detach; readback OK, MCP скрин может отставать |

_Новый export или находка в сессии → строка здесь + §D; при новом типе экрана — секция в §3._
