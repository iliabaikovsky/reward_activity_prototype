# Правила отображения транзакций (Upcoming drill / `V2SummaryCurrencyDetailPage`)

Документ задаёт **копирайт и смысловые правила** для строк в списке выплат на экране детализации Upcoming cashback / Upcoming rewards (прототип). Реализация в коде должна следовать этим правилам.

---

## 1. EXD cashback (только в контексте **USD** / «Upcoming cashback»)

| Поле | Правило |
|------|--------|
| **Заголовок** | `EXD cashback` |
| **Источник данных** | Строки `lifecycle.upcoming[]` с `icon: 'dollar'` на текущем шаге симулятора. |
| **Подзаголовок / line1** | Из `lines[0]` item, напр. `For trading on Mar 16`. |
| **Дата выплаты** | Парсится из колонки `date` (`on Mar 18` → `parseUpcomingPayoutDate`). |

**Группировка по дням:** секция **Tomorrow**, если дата = `simulatorTodayIso + 1 day`; иначе короткая дата (`Mar 25`, …).

---

## 2. Loyalty rewards (начисление EXD по лояльности)

**Только экран EXD («Upcoming rewards»).** На экране **USD («Upcoming cashback»)** строк **`Loyalty rewards` нет** — там только EXD cashback.

| Поле | Правило |
|------|--------|
| **Заголовок** | `Loyalty rewards` |
| **Источник данных** | Строки `lifecycle.upcoming[]` с `icon: 'crown'`. |
| **Подзаголовок / line1** | Из `lines[0]`, напр. `For trading on Mar 18–22`. |
| **Дата выплаты** | Из `date` (`on Mar 25`). |
| **Badge** | Опционально из `badge` item (напр. `4` на шаге 3). |

Drill-in **не синтезирует** суммы и периоды — показывает те же строки, что на главном экране Upcoming.

---

## 3. Накладка: две Loyalty в Upcoming

Период торговли: **среда–воскресенье**. Активация — **среда следующей недели**.

| Слот | Когда показывается | Зачисление |
|------|-------------------|------------|
| **Прошлый период** | Понедельник–вторник недели активации, до среды зачисления | **Эта** среда |
| **Текущий период** | С понедельника недели открытия периода до даты активации (не включая день активации) | **Следующая** среда |

**Пример (шаг 9, 17 Mar 2026, вторник):** две строки в `upcoming[]` — `Mar 11–15` → `Mar 18` и `Mar 18–22` → `Mar 25`.

Справочная логика накладки для моков: `getLoyaltyUpcomingSlots()` в `src/rewardLifecycle/demoTimeline.ts` (drill-in больше не вызывает её напрямую).

---

## 4. UI экрана drill-in

| Элемент | Правило |
|---------|--------|
| **Hero** | Заголовок + сумма всех видимых строк. |
| **Список** | Группировка по дате выплаты (`Tomorrow`, `Mar 25`, …) относительно `demoTodayIso` шага. |
| **График / фильтры** | **Не показываются** (убраны из прототипа). |

---

## 5. Согласованность USD / EXD экранов

- **Upcoming cashback (USD):** строки **EXD cashback** из `upcoming[]` (icon dollar).
- **Upcoming rewards (EXD):** строки **Loyalty rewards** из `upcoming[]` (icon crown); без EXD cashback.

Long term rebates в Upcoming drill-in **не показываются**.

---

## 6. Изменения в коде (чеклист)

- [x] Убраны long term rebates из drill-in.
- [x] Убраны график и фильтры из `V2SummaryCurrencyDetailPage`.
- [x] `buildDrillEntriesFromUpcoming` — строки из `lifecycle.upcoming[]` + `demoTodayIso` (per-step).
- [x] Заголовок транзакции cashback в UI: **EXD cashback** (не «Cashback»).
- [x] Документ с правилами (этот файл).
