# Прототип → Figma (MCP workflow)

Универсальный процесс: собрать экран в Figma из **кода прототипа** и **подключённой design system**, без скриншот-генерации и без привязки к одному компоненту.

**Связанные документы:** [`FIGMA_NAMING.md`](FIGMA_NAMING.md), [`FIGMA_VISUAL_QA.md`](FIGMA_VISUAL_QA.md), [`FIGMA_CURSOR.md`](FIGMA_CURSOR.md) (обратное направление), [`DESIGN.md`](DESIGN.md). Skill: [`.cursor/skills/prototype-to-figma/SKILL.md`](../../.cursor/skills/prototype-to-figma/SKILL.md).

**CE-3142 (этот репо):** конфиг проекта — [§3](#3-конфиг-проекта-ce-3142); каталог DS и node-id — [приложения A–C](#приложение-a-ce-3142--карта-ds).

---

## 1. Принципы (универсальные)

Думать **категориями** (слот, строка, chrome, composite), а не именами конкретных Figma-компонентов. Имена DS меняются; принципы — нет.

### 1.1 Source of truth

| Слой | Что решает |
|------|------------|
| **Прототип** (код + скриншоты + CSS) | copy, порядок полей, наличие/отсутствие UI (chevron, divider, nested nav) |
| **Design system** (подключённая lib) | *как* выразить элемент — instance, prop, swap |
| **Designer reference** в файле | структурный референс layout; **не** слепой clone целиком |

Данные берут из **активного состояния** прототипа (шаг симулятора, route, variant), не из устаревшего static config или старой ноды.

### 1.2 INVENTORY — local composites first

**До** `search_design_system` и **до** clone designer reference — пройти **целевой Figma-файл** на готовые agent/product composite.

| Приоритет | Источник | Роль |
|-----------|----------|------|
| **1** | **INVENTORY** — Components page + [`FIGMA_NAMING.md`](FIGMA_NAMING.md) §2 + [Appendix C](#приложение-c-node-id-cursor-export) | переиспользуемые блоки (**Summary**, …) — **instance**, не inline rebuild |
| **2** | **Library-first** (§1.2a) — внешняя DS | только то, чего нет в INVENTORY |
| **3** | **Designer reference** | layout-hint; **запрещён** как единственный источник primary block и row data |

**Pre-flight (обязательно, до первого assemble `use_figma`):**

1. Прочитать Appendix C + `FIGMA_NAMING.md` §2 — какие composite уже есть для шаблона экрана.
2. `get_metadata` на Components page проекта — список `Exness Rewards / …` (или аналог в другом репо).
3. В ответе пользователю **перечислить** local instances: имя + node-id, что будет на экране.

**Сигналы anti-pattern:**

- Собрать inline hero/summary, если для шаблона (Order detail → **Summary**) composite уже на Components page.
- Не открывать Appendix C / не inspect Components page перед export.
- Clone reference целиком вместо instance существующего composite.

### 1.2a Library-first

1. `get_libraries` → найти целевую lib.
2. `search_design_system` — примитив под **роль** (nav bar, list row, badge, spacing), не под запомненное имя — **после** INVENTORY.
3. Сборка: **instances** + props/overrides. ❌ `generate_figma_design` для DS handoff.

### 1.3 Clone → strip → override → verify

Reference-нода в Figma ускоряет layout и тащит **наследие**:

1. **Clone** — каркас.
2. **Strip** — `remove()` лишнего и hidden-мусора; не `visible=false` как замена удаления.
3. **Override** — текст, данные, props, swap по прототипу.
4. **Verify** — screenshot vs прототип (TRACE, §1.6).

### 1.4 Composites vs screens

| Тип | Смысл | Куда (политика проекта) |
|-----|-------|-------------------------|
| **Screen** | полное видимое состояние для ревью | agent canvas page |
| **Composite** | переиспользуемый блок; на экране — **instance** | components page |

Повторяющийся блок (hero, card, field group) → composite master один раз, дальше instances.

### 1.5 SLOT — props и слоты

Любой DS-instance: сначала понять **тип** свойства, потом чинить.

| Тип prop | Эффект | Правка |
|----------|--------|--------|
| **Boolean** | показывает/скрывает **контейнер** (слот) | не меняет child внутри |
| **Instance swap** | меняет variant поддерева | `setProperties({ 'Prop#id': componentKey })` |
| **Variant** | ветка component set | `setProperties` variant value |
| **Text** | copy | `loadFontAsync` → `characters` |
| **Structure** | лишняя/неверная обёртка | `remove()` / пересобрать иерархию |

**Алгоритм SLOT** (визуал ≠ прототип после props):

1. **Source** — код, скрин, route/state.
2. **List** — `componentProperties`, тип каждого prop.
3. **Open** — boolean ON, но не то → спуститься в layer tree слота; найти default child instance.
4. **Fix** — swap prop **или** `swapComponent` на child **или** restructure.
5. **Screenshot** — пустой слот = скрыли child вместо замены.

❌ `child.visible = false` как единственный fix.

**Сигнал:** boolean уже ON, визуал дефолтный или пустой → не крутить ещё booleans; SLOT шаги 3–4.

### 1.6 TRACE — visual QA

Обязательно **по элементам**, не «в целом похоже»:

1. **T**arget — зафиксировать state (step, route, variant).
2. **R**eference — скриншот прототипа + релевантный код/CSS.
3. **A**ssemble — DS instances по категориям ([`FIGMA_VISUAL_QA.md`](FIGMA_VISUAL_QA.md) §1).
4. **C**ompare — **обязательный** Figma screenshot vs reference (§1.10); построчно §1; статус OK / Fixed / Open / **Ask**.
5. **E**scalate — при Ask остановиться; при Fixed — fix loop → снова §1.10; после ревью — урок в §D.

### 1.10 Post-export gate — **визуальный** скриншот Figma (обязательно)

**Задача не завершена**, пока не выполнен gate. Истина — **то, что видно на canvas Figma**, а не Plugin API.

#### Иерархия доказательств (VISUAL)

| Приоритет | Источник | Роль |
|-----------|----------|------|
| **1 — решающий** | **Растровый скриншот** финального frame из Figma | gate, ответ пользователю |
| **2 — решающий** | Скриншот пользователя («как вижу в Figma») | тот же gate; при конфликте с readback — **верить пользователю и скрину** |
| **3 — вспомогательный** | `node.characters`, `componentProperties`, `return { verify }` из `use_figma` | только для отладки и поиска слоя; **не** закрывает задачу |
| **4 — вспомогательный** | Layer tree / `findAll(TEXT)` в plugin | структура и hygiene; не заменяет пиксели |

**Readback OK + скрин FAIL = FAIL.** Нельзя писать «готово» и ссылаться на `characters`.

#### Как снять скриншот с Figma (не «только API»)

Минимум **один** способ на каждый проход gate; предпочтительно **два** (plugin + MCP), если расходятся:

| Способ | Когда | Заметки |
|--------|-------|---------|
| **`get_screenshot` MCP** | после каждого `use_figma` перед ответом | `fileKey` + `nodeId` финального frame; `scale` ≥ 2 для мелкого copy |
| **`await frame.screenshot()`** | в том же `use_figma`-скрипте | сразу после последней правки; приложить к `return` |
| **Скрин поддерева** | primary block / одна строка не сходится | `summary.screenshot()`, `row.screenshot()` — локализовать слой |
| **Скрин пользователя** | пользователь прислал canvas | принять как gate input; не спорить с readback |

❌ Считать `frame.screenshot()` в tool output достаточным **без** анализа пикселей агентом.  
❌ Пропускать скрин, если `return { verify: { amount: '…' } }` уже «всё OK».

**Перед ответом пользователю — всегда:**

1. **Figma screenshot** — `get_screenshot` MCP **и/или** `await frame.screenshot()` на финальный frame; **просмотреть** изображение (или описать расхождения по категориям).
2. **Prototype reference** — `docs/screenshots/…` или dev screenshot для того же state (TRACE step T).
3. **Compare** — категории [`FIGMA_VISUAL_QA.md`](FIGMA_VISUAL_QA.md) §1; в ответе — **таблица** (категория · прототип · Figma visual · статус).
4. **Fix loop** — любой не-OK → правка → **новый скриншот** с шага 1 (не повтор readback).
5. **Log** — кейс в `FIGMA_VISUAL_QA.md` §3–§4; универсальный урок в §D.

| ❌ Недостаточно | ✅ Gate пройден |
|----------------|-----------------|
| Только `return { texts: [...] }` / readback | + растровый скрин + разбор пикселей |
| Readback совпал — скрин не смотрели | скрин снят и сверен с reference |
| «Скрин в attachment, проверь сам» | агент заполнил compare-таблицу |
| Сверка «в целом похоже» | построчно по §1 QA |
| Сразу «готово» после assemble | compare → fix → **re-screenshot** → OK |

**Сигнал:** нет таблицы сверки **и** нет анализа Figma screenshot — export **не закончен**.

#### Incremental gates (блокеры между assemble и Gate-full)

Не ждать финала — снимать и анализировать скрин **по этапам**:

| Checkpoint | Когда | Категории | Блокер |
|------------|-------|-----------|--------|
| **Gate-F** | после размещения primary block (Summary instance) | F (amount, chip, icon) | любой FAIL → **не** добавлять field list |
| **Gate-GH** | после всех KV rows | G (каждая label/value), H (divider, chevron, badge) | placeholder `Label` / `Title` = FAIL |
| **Gate-full** | перед ответом пользователю | A–K | таблица со **всеми** строками |

Скрин пользователя («как вижу в Figma») = немедленный **Gate-full**. Compare-таблица для F и G — **построчно** (amount, chip, каждая row), не «в целом OK».

### 1.11 RENDER — readback ≠ canvas (универсальный сбой)

**Симптом:** Plugin API / `findAll(TEXT)` показывает верный copy, а **скриншот Figma** (и пользователь) — placeholder (`Title`, `Label`) или данные **designer reference**, не прототипа.

**Причины (категории, не один баг):**

| Категория | Что происходит | Направление fix |
|-----------|----------------|-----------------|
| **INK / instance** | override записан в модель, canvas не обновился до клика | **REHYDRATE** §1.8a (re-apply props → toggle variant → `swapComponent` на **том же** main); ❌ `detachInstance` |
| **Clone hygiene** | слепой clone reference тащит чужие значения в **рендер** | strip + не копировать reference как data source; данные только из прототипа |
| **Dual end slot** | у list row два канала значения (swap prop + accessory) | inspect оба; выставить variant **и** ink видимый слот; один канал off |
| **Composite on screen** | master на components page OK, instance на экране — нет | gate на **экране**, не только на master |

**Алгоритм RENDER** (если readback OK, скрин FAIL):

1. Зафиксировать FAIL в compare-таблице (не закрывать задачу).
2. Локализовать: скрин поддерева (primary block, одна row).
3. INK повторно на **видимом** слоте; при необходимости detach проблемного instance.
4. Если после 2 циклов скрин всё ещё FAIL — **не clone reference целиком**; собрать с нуля из DS + composite.
5. Урок → §D + §1.9 (обязательно в той же сессии).

### 1.7 Semantic layer tree

Имя **корневого frame** — в [`FIGMA_NAMING.md`](FIGMA_NAMING.md).  
Имена **внутри** дерева — так же важны для handoff: дизайнер и агент должны читать layers без угадывания.

**Правило:** каждый созданный или оставленный **wrapper** (frame / group / auto-layout) называется по **роли в UI**, не дефолтом Figma.

| Роль в дереве | Как называть | ❌ Не оставлять |
|---------------|--------------|-----------------|
| Тело экрана под shell | `Content` | `Frame 1`, `Group 12` |
| Primary block (summary) | `Summary` (instance composite) | `Frame 2` |
| Список полей / KV | `Field list` | `Frame 4` |
| Одна строка списка | `Row / {label}` или имя DS-cell | безымянный frame вокруг cell |
| Отступ / rhythm | `Spacing` (+ pt при необходимости) | `Frame 5` |
| Нижние ornaments | `Footer` | `Group 1` |

**Instance из DS** — оставить имя компонента (`TableView Cell (iOS)`, `Badge`) или уточнить слой: `Row / Order`. Не переименовывать внутренности instance без причины.

**Когда переименовывать:** после assemble и strip, **до** TRACE — шаг **label** в workflow §2. После `clone()` — пройти дерево и заменить все `Frame \d+` / `Group \d+` на роли.

**Язык:** как в DS/handoff файла (для CE-3142 — **English**). Copy в текстовых слоях — из прототипа; **имена слоёв** — структурные, не пользовательский текст.

**Связь с TRACE:** категории §1 в `FIGMA_VISUAL_QA.md` (F = primary block, G = field list, …) → те же слова в layer tree.

### 1.8 INK — text на instance (без ручного клика)

**Симптом:** в canvas placeholder (`Title`, `Label`), а после клика в Figma — правильный copy (`Upcoming`).  
**Причина:** агент не довёл override до конца или canvas не обновился; **не** нужно «прокликивать» вручную — это делает Plugin API + verify.

Принцип: copy на instance — **два канала** (проверить оба):

| Канал | Когда | Как |
|-------|-------|-----|
| **TEXT component property** | в `componentPropertyDefinitions` есть `type: TEXT` | `instance.setProperties({ 'Title#…': 'Upcoming' })` |
| **Nested TEXT layer** | нет TEXT prop или placeholder-слой (`Title`, `Label`, `Value`) | `loadFontAsync` → `characters = value` |

**Алгоритм INK** (после assemble, до TRACE):

1. **Inspect** — `mainComponent` / component set → `componentPropertyDefinitions`; отметить TEXT keys.
2. **Property** — для каждого TEXT prop: `setProperties` с copy из прототипа.
3. **Nested** — `instance.findAll(TEXT)` или `query('TEXT[name=Title]')`; для каждого релевантного слоя — canonical font recipe → `characters`.
4. **Know** (вспомогательно) — readback `characters` / `componentProperties` для отладки.
5. **See** (обязательно) — **растровый** скрин Figma (§1.10): `get_screenshot` и/или `frame.screenshot()`; агент **анализирует** пиксели, не только прикладывает файл.
6. **Reconcile** — readback OK, скрин FAIL → **REHYDRATE** §1.8a → **RENDER** §1.11; gate не пройден, пока скрин не OK.

❌ Считать export готовым при readback OK и placeholder на скрине.  
❌ **`detachInstance`** на DS/agent composite как «fix» — ломает INVENTORY и связь с master.  
❌ Overlay text / wrapper / пересборка hero с нуля, если есть local composite.

### 1.8a REHYDRATE — принудительное обновление instance (без detach)

**Симптом:** copy верный в `characters` / readback, на canvas placeholder (`Title`, `Label`) до ручного клика в Figma.

**Жёсткие ограничения:** не detach; не overlay; не wrapper; не править read-only DS source; agent-owned composite master (`🧩 Components`) — ink на master допустим.

**Алгоритм** (для каждого проблемного instance):

1. **Inspect** — `componentProperties`; TEXT props → `setProperties` первым.
2. **INK** — nested TEXT: `loadFontAsync` → `characters` (дважды).
3. **Re-apply** — `setProperties` со snapshot всех текущих props.
4. **Toggle** — безвредный VARIANT/BOOLEAN → обратно в целевое состояние.
5. **swapComponent** — `swapComponent(instance.mainComponent)` → re-apply saved props → повтор INK на nested.
6. **Nudge** — только если не locked: `x ± 0.01` на instance (не на child с layout override).
7. **Verify** — readback + **растровый скрин** поддерева; отчёт: fixed / still manual.

**Scope swap:** `swapComponent` — на **вложенном** проблемном instance (Badge, End accessory), не на root TableView Cell (сбрасывает `Custom` и слоты). Для cell: зафиксировать `CELL_PROPS` (`Custom=false`, …) до и после.

❌ `resetOverrides()` без re-INK + gate.  
❌ Detach как substitute для REHYDRATE.

**Универсальный helper-паттерн** (в каждом export-скрипте):

```js
async function inkText(node, value) {
  if (!node || node.type !== 'TEXT') return null;
  for (const seg of node.getStyledTextSegments(['fontName'])) {
    await figma.loadFontAsync(seg.fontName);
  }
  node.characters = value;
  node.characters = value; // nudge flush
  return { id: node.id, readback: node.characters };
}
```

Для **любого** instance с copy (badge, nav title, list cell) — INK, не только hero.

### 1.9 Learn loop — дописывать правила в процессе

**Не ждать ревью.** Любое открытие в сессии (баг, расхождение скрина и API, feedback пользователя) → сразу универсальный урок в docs/rules.

1. Сформулировать **категорию** (SLOT, INK, RENDER, VISUAL gate, clone hygiene, data source, layer naming, …) — **без привязки** к одному component id, если можно.
2. Записать в [§D журнал](#d-журнал-уроков) + при необходимости §1 (новый подпункт или строка в таблице).
3. Синхронизировать: [`FIGMA_VISUAL_QA.md`](FIGMA_VISUAL_QA.md) §4, [`.cursor/rules/figma-prototype-to-figma.mdc`](../../.cursor/rules/figma-prototype-to-figma.mdc), [skill `prototype-to-figma`](../../.cursor/skills/prototype-to-figma/SKILL.md).
4. Проектные node-id / имена DS — только приложения / кейс §3 QA; принцип — в §1.

---

## 2. Workflow MCP (универсальный)

Перед каждым `use_figma` — skill **`figma-use`**.

```text
TARGET state (код + скрин)
    → INVENTORY (§1.2): Appendix C + Components page + перечислить local instances
    → get_libraries + search_design_system — только для ролей без composite
    → assemble с нуля ИЛИ partial layout-hint (не слепой clone reference для data)
    → Summary / composites: instance из INVENTORY, не inline hero
    → strip наследия (remove)
    → override: SLOT + INK (§1.8)
    → label: semantic names (§1.7)
    → Gate-F (скрин Summary) — блокер
    → field list rows → Gate-GH (скрин rows) — блокер
    → Gate-full (§1.10): растровый скрин frame + compare A–K
    → RENDER §1.11 / fix loop + re-screenshot
    → learn loop §1.9: §D в той же сессии
```

**Текст в Figma:** INK §1.8 — TEXT prop + nested TEXT; **закрытие** — только VISUAL gate §1.10 (скрин), не readback.

**Inspect:** `get_metadata`, `componentProperties`, layer tree под слотами — для правок; **приёмка** — screenshot.

**Мелкие шаги:** assemble → **скрин + таблица** → fix → **новый скрин** → ответ пользователю.

---

## 3. Конфиг проекта (CE-3142)

Проектные конвенции; для другого репо — своя §3, принципы §1–2 те же.

### Размещение

| Артефакт | Страница Figma | Page node |
|----------|----------------|-----------|
| Экраны от агента | **Cursor figma** | `42433:17909` |
| Composites | **🧩 Components** | `28922:36022` |
| Designer reference | product canvas | — |

Не плодить agent-output на product canvas без запроса.

### Именование и frame

- Путь: `Exness Rewards / {context} / {detail} -- {state}` — [`FIGMA_NAMING.md`](FIGMA_NAMING.md).
- Frame: **375 × min 812** (`.device-frame`).

### Источники данных (этот прототип)

| Уровень | Код |
|---------|-----|
| Simple modal | `simpleConfigs.ts` |
| Pack | `packConfigs.ts`, `packDetailRows.ts` |
| Order detail | `OrderInPack.detail`, `*OrderDetailRows.ts` |
| Поля / copy | `TRANSACTIONS_CATALOG.md` |

Скриншоты: `docs/screenshots/modals*/`. Стили: `RewardDetailModal.module.css`.

### Библиотека

**Core components / Apps** — `search_design_system` с `includeLibraryKeys` из `get_libraries`.

---

## Приложение A. CE-3142 — карта DS

Справочник «роль → типичный примитив»; при расхождении побеждает **прототип** + SLOT, не эта таблица.

| Роль UI | Типичный примитив Core Apps |
|---------|----------------------------|
| Sheet + status + nav | `Top bar (iOS) (Detach me)` |
| Nav title / start / end | `Top Navigation (iOS)` |
| Hero icon | `Button (iOS)` |
| Status chip | `Badge` |
| KV row | `TableView Cell (iOS)` |
| Vertical rhythm | `Spacing` |
| Home indicator | `Home Indicator` |

Продуктовые composite (опционально): `UI Kit / EXD`.

### SLOT-примеры в CE-3142 (не правила, а иллюстрации §1.5)

| Симптом (категория) | Тип fix | Где искать |
|---------------------|---------|------------|
| Неверная **chrome action** (back vs close) | boolean + **swap child** | nav → start slot → default `x` → `chevron-left` |
| Лишний **trailing affordance** в строке | **instance swap** prop | list cell → end content variant |
| Неверная **обёртка** chip | **structure** | hero → badge direct child |
| Лишние **разделители** строк | **boolean** off | list cell divider prop |
| **Наследие** после clone | **strip** | hidden blocks → `remove()` |

Конкретные prop id и keys — в коде export-скрипта / metadata ноды; не заучивать — **inspect** при каждой сессии.

---

## Приложение B. CE-3142 — шаблоны экранов

| Шаблон | Смысл | Наполнение |
|--------|-------|------------|
| **Simple** | одна модалка без drill-down | hero + few KV + optional block |
| **Order detail** | nested route | hero instance + KV по row config |
| **Pack** | aggregate + list | hero + pack KV + orders |

Composite в файле: `Exness Rewards / Transaction detail / Summary` (`42450:9311`).

---

## Приложение C. Node-id (Cursor export)

| Node | Описание |
|------|----------|
| `42507:155` | Loyalty reward order detail — Upcoming (rebuild, INVENTORY + REHYDRATE) |
| `42450:9311` | Transaction detail / Summary composite (instance on screen; master ink OK) |
| `42421:16687` | Designer ref: Simple gift |
| `42413:32765` | Designer ref: full order (не копировать слепо) |

---

## D. Журнал уроков

Формулировки — **универсальные**; CE-3142 — в скобках как пример.

| Дата | Урок |
|------|------|
| 2026-06-10 | **Structure:** status chip — прямой instance badge, не лишняя accessory-обёртка (hero). |
| 2026-06-10 | **Boolean:** dividers в list row — выключить по прототипу (нет border в CSS). |
| 2026-06-10 | **Instance swap:** trailing chevron только если флаг в row model (`chevron: true`). |
| 2026-06-10 | **Strip:** после clone — `remove()` hidden blocks, не оставлять в дереве. |
| 2026-06-10 | **Composite policy:** reusable hero на components page; screens на agent canvas. |
| 2026-06-10 | **Naming / frame:** path convention + min height device frame. |
| 2026-06-10 | **Data source:** активный шаг симулятора, не static pack. |
| 2026-06-10 | **SLOT:** boolean включает слот, не меняет child (nav back — swap, не hide). |
| 2026-06-10 | **TRACE / Ask:** status bar in sheet — открытый вопрос дизайну. |
| 2026-06-10 | **Docs:** правила universal-first; component names только в приложениях. |
| 2026-06-10 | **Layer tree:** wrappers по роли (`Content`, `Field list`), не `Frame 1` / `Frame 4`. |
| 2026-06-10 | **INK:** placeholder `Title` до клика = незавершённый text override; TEXT prop + nested TEXT + readback + screenshot. |
| 2026-06-10 | **Composite naming:** `Transaction detail / Summary` вместо `Detail / Hero` — function over marketing label. |
| 2026-06-10 | **Post-export gate (§1.10):** без Figma screenshot + compare с прототипом export не считать готовым. |
| 2026-06-10 | **VISUAL (§1.10):** приёмка по **растровому** скрину Figma (`get_screenshot` / `frame.screenshot()`), не по plugin readback. |
| 2026-06-10 | **RENDER (§1.11):** readback `characters` может совпадать с прототипом, пока скрин показывает placeholder или reference copy — gate FAIL. |
| 2026-06-10 | **User canvas:** скрин пользователя = тот же gate; при расхождении с API — верить скрину. |
| 2026-06-10 | **Clone hygiene:** designer reference — layout only; слепой clone ≠ data source (рендер может остаться на reference). |
| 2026-06-10 | **Dual end slot:** list row — swap prop «end content» и accessory-слот; ink и gate на **видимом** канале. |
| 2026-06-10 | **Learn loop (§1.9):** открытие в сессии → сразу §D + rule + skill; не откладывать до «потом». |
| 2026-06-11 | **INVENTORY (§1.2):** до library/reference — inspect local composite; Order detail → instance Summary, не inline hero. |
| 2026-06-11 | **Incremental gates:** Gate-F / Gate-GH / Gate-full — блокеры; не идти к rows при FAIL Summary. |
| 2026-06-11 | **Не rebuild hero:** если composite на Components page — только instance + overrides. |
| 2026-06-11 | **REHYDRATE (§1.8a):** re-apply props → toggle variant → nested `swapComponent`; не detach. |
| 2026-06-11 | **swapComponent на cell root** сбрасывает `Custom`/слоты — только nested End accessory / Badge. |

_Новый feedback или находка в процессе → универсальная формулировка в таблице + кейс в `FIGMA_VISUAL_QA.md` §4._
