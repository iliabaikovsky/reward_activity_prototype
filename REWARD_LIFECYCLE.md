# Жизненный цикл EXD и Cashback: пользовательский путь и UI

Документ для реализации в интерфейсе **Exness Rewards** (прототип: hero, кошельки **Available rewards** / торговый счёт, **Upcoming**, **Activity feed**, bottom sheets деталей).  
События и состояния — без UX-споров; цифры — **примеры** для моков и API.

См. также: `DESIGN.md` (Figma, экраны), типы в ленте — `src/screens/activityFeedTypes.ts`.

### Прототип: симулятор шагов

Справа от рамки телефона — панель **«Симулятор жизненного цикла»** (`LifecycleSimulatorPanel`, данные `LIFECYCLE_STEPS` в `src/rewardLifecycle/lifecycleSteps.ts`). Старт с **шага 1** — пустое состояние (§0); кнопки **Назад / Далее** и выпадающий список ведут по сценарию §12. На каждом шаге обновляются: **Available rewards**, второй кошелёк, **Lifetime cashback**, **Upcoming**, превью **Activity feed** на главном экране и полная лента на экране **Activity feed** (с учётом фильтров).

**Календарь в коде:** якорь **20 Mar 2026** (`DEMO_TODAY_ISO` в `src/rewardLifecycle/demoTimeline.ts`), пресет ленты **This month** = March 2026. **Loyalty в Upcoming:** период в подписи — **среда–воскресенье**; дата справа в формате **`on {среда активации}`** (зачисление в среду следующей недели после конца периода). Пример при «сегодня» 20 Mar: открытый период **Mar 18–22** → **`on Mar 25`**.

**Промежуточный шаг симулятора** (`upcoming_loyalty_more`): между первым Upcoming **+3.20 EXD** и шагом активации в Available — ещё одна сделка в том же периоде, пачка растёт до **+4.20 EXD** (badge **4**), чтобы в UI было видно изменение Upcoming до перехода к активации.

**Деталка Loyalty (bottom sheet):** для вариантов `loyalty-upcoming` и `loyalty-activated` данные пачки собираются из шага симулятора (`buildLoyaltyModalPack.ts`): те же **сумма**, **период**, **Become available on / Moved to available on**, что на списке; **ордера** — несколько строк, в сумме дающих агрегат (без раздувания до 200). Из ленты открытие передаёт `feedItemId`, чтобы совпадала конкретная транзакция.

---

## Карта интерфейса ↔ данные

| Зона UI | Что отражает |
|--------|----------------|
| **Hero / прогресс EXD** | Агрегаты по программе (опционально), не дублирует кошелёк |
| **Кошелёк «Available rewards»** | Баланс EXD, готовый к переводу (`available_exd`) |
| **Кошелёк торгового счёта** | EXD на счёте + отображение USD cashback (по продукту) |
| **Upcoming** | Неподтверждённые начисления: loyalty (пачка за период), cashback pending |
| **Activity feed** | Подтверждённые события: активация (+ при необходимости adjustment в тот же день), transfer, cashback credited, special reward |
| **Bottom sheet** | Детали строки: для пачек — ордера (**Last 3 orders** + полный список) |

---

## 0. Начальное состояние (новый пользователь)

| Секция | Состояние |
|--------|-----------|
| Upcoming | пусто |
| Available rewards | **0.00 EXD** |
| Activity feed | нет транзакций |

**Снимок для UI:** все суммы `0`, лента пустая или плейсхолдер.

---

## 1. Правила начисления (константы для примеров)

| Правило | Формула (пример) |
|---------|------------------|
| Loyalty reward за сделку | **EXD = 10% × spread** (в USD) |
| EXD как rebate на сделке | **EXD spend = 50% × spread** → событие **EXD → Cashback** |
| Cashback pending | Отражает ожидаемый **USD** к зачислению на счёт после settlement |

---

## 2. Торговля только на USD-счёте — копится Upcoming (loyalty)

**Сделка A:** spread = **10 USD** → reward = **1.0 EXD** → Order **#1001**.

**Несколько сделок в одном «окне» до активации:**

| Order | Spread (USD) | Reward (EXD) |
|-------|----------------|--------------|
| #1001 | 10 | +1.0 |
| #1002 | 8 | +0.8 |
| #1003 | 14 | +1.4 |

**Агрегат в Upcoming (одна строка-пачка):**

- Заголовок: **Loyalty rewards**
- Сумма: **+3.2 EXD** (1.0 + 0.8 + 1.4)
- Внутри пачки (модалка): ордера #1001, #1002, #1003 с индивидуальными суммами

**Activity feed:** записей **нет** (rewards ещё не активированы).

**Cashback pending в списке Upcoming (прототип):** одна подпись **`For trading on Mar 22`** (день сделки, константа `CB_PENDING_TRADE_DAY_SHORT` в `demoTimeline.ts`).

---

## 3. Недельная активация — `reward_activation`

**Системное событие:** `reward_activation`  
**Название в UI:** **Loyalty rewards**

**Пример транзакции в ленте:**

| Поле | Значение |
|------|----------|
| Заголовок | Loyalty rewards |
| Сумма | **+3.2 EXD** |
| Подзаголовок / период | For trading on **Jan 5–10** |
| Куда | To **Available rewards** |

**Изменение состояния:**

| Секция | Было → Стало |
|--------|----------------|
| Upcoming | **очищено** (по этой пачке) |
| Available rewards | **0 → +3.2 EXD** (зачисление loyalty) |
| Activity feed | **+1** строка (Loyalty rewards) |

**Сразу после (тот же день, прототип):** системное событие **`adjustment`** — **−0.4 EXD** (анти-абьюз / balance correction), запись **EXD adjustment** в ленте.

| Секция | После adjustment |
|--------|------------------|
| Available rewards | **2.80 EXD** (3.2 − 0.4) |
| Activity feed | **ещё +1** строка в тот же календарный день |

В симуляторе шаг **`activation_1`** объединяет оба события; отдельного шага «только корректировка» нет.

---

## 4. Подарок / бонус — `special_reward` (врезка во времени)

**Момент:** **19 Mar 2026, 16:15** — **Birthday gift** (в ленте описание: **Best wishes! ✨**).

| Поле | Пример |
|------|--------|
| System type | `special_reward` |
| UI | **Birthday gift** / **Special reward** |
| Сумма | **+50.00 EXD** |
| Куда | Available rewards |

**Состояние после:**

| Секция | Значение |
|--------|----------|
| Available rewards | 2.8 + 50 = **52.8 EXD** |
| Activity feed | новая строка (фильтр **Others** / **Rewards** — по продукту) |

*Для прототипа см. вариант `promo-gift` в `RewardDetailModal`.*

---

## 5. Корректировка — `adjustment`

**Анти-абьюз:** система уменьшает доступный баланс (**EXD adjustment**).

| Пример | Значение |
|--------|----------|
| UI | **EXD adjustment** / **Adjustment** |
| Сумма (демо) | **-0.4 EXD** |

**В прототипе** первая корректировка применяется **в том же шаге и дне**, что и недельная активация loyalty (§3): Available после пары событий = **2.80 EXD**, затем gift (§4) даёт **52.8 EXD**. Отдельной даты «день только adjustment» в симуляторе нет.

---

## 6. Перевод на торговый счёт — `transfer`

| Пример | Значение |
|--------|----------|
| UI | **Transfer** |
| Сумма | **-52.8 EXD** |
| Получатель | To account **#12345678** |

**Состояние:**

| Секция | Было → Стало |
|--------|----------------|
| Available rewards | 52.8 → **0 EXD** |
| Trading account (EXD) | **+52.8 EXD** |
| Activity feed | **+1** строка |

---

## 7. Сделка с использованием EXD на счёте — два события в Upcoming

**Сделка B:** spread = **10 USD**

| Механика | Величина |
|----------|-----------|
| EXD spend (rebate) | **50% × 10 = 5 USD** эквивалент → событие **EXD → Cashback** |
| Новый loyalty за эту же сделку | **10% × 10 = 1.0 EXD** → Order **#2001** |

**В Upcoming одновременно:**

| Строка | Сумма | Примечание |
|--------|-------|------------|
| Cashback pending | **+5 USD** | до settlement |
| Loyalty rewards | **+1.0 EXD** | копится к следующей неделе |

**Activity feed:** по этой сделке **пока без** финального Cashback (см. следующий шаг).

---

## 8. Следующий день — settlement cashback — `cashback`

**Системное событие:** начисление USD после settlement.

| Поле | Значение |
|------|----------|
| UI | **Cashback** |
| Сумма | **+5.00 USD** |
| Счёт | Trading account **+5 USD** |

**Состояние:**

| Секция | Изменение |
|--------|-----------|
| Upcoming | строка **Cashback pending** исчезает |
| Activity feed | **+1** строка Cashback |
| Trading account | **+5 USD** |

---

## 9. Дальнейшая торговля — loyalty снова в Upcoming

**Сделки:**

| Order | Spread | Reward (10%) |
|-------|--------|----------------|
| #2001 | 8 USD | +0.8 EXD |
| #2002 | 12 USD | +1.2 EXD |

**Upcoming:**

- **Loyalty rewards +2.0 EXD** (агрегат пачки)

---

## 10. Следующая неделя — вторая активация

**Событие:** `reward_activation`

| Лента | Пример |
|-------|--------|
| Заголовок | Loyalty rewards |
| Сумма | **+2.0 EXD** |
| Период | For trading on **Jan 11–17** |

| Секция | Изменение |
|--------|-----------|
| Upcoming | очищено (по этой пачке) |
| Available rewards | **+2.0 EXD** |
| Activity feed | +1 строка |

---

## 11. Типы событий (system → UI)

| System type | UI название | Кратко |
|-------------|-------------|--------|
| `loyalty_reward` | Loyalty reward | Позиция за **одну** сделку (внутри пачки / деталь) |
| `reward_activation` | Loyalty rewards | Недельная активация пачки → Available |
| `exd_to_cashback` | EXD → Cashback | Списание EXD под rebate (связано с сделкой) |
| `cashback` | Cashback | Зачисление **USD** после settlement |
| `transfer` | Transfer | Перевод EXD на торговый счёт |
| `adjustment` | Adjustment | Корректировка доступного EXD |
| `special_reward` | Special reward / Gift | Бонусы, подарки, промо |

---

## 12. Временная шкала (сквозной пример с цифрами)

Условные даты для одного пользователя и одного счёта **#12345678**:

| Когда | Событие | Upcoming (кратко) | Available EXD | Лента |
|-------|---------|-------------------|---------------|--------|
| **Jan 1** | Регистрация | — | 0 | — |
| **Jan 5–10** | Сделки → ордера #1001–#1003 | Loyalty **+3.2** | 0 | — |
| **Jan 10** EOD | `reward_activation` + `adjustment` | ∅ | **2.8** | +Loyalty +3.2; −0.4 (тот же день) |
| **Jan 15** | `special_reward` (gift) | — | **52.8** | +Gift +50 |
| **Jan 17** | `transfer` | — | **0** | -52.8 EXD |
| **Jan 18** | Сделка spread 10, EXD на счёте | Cashback **+5 USD** + Loyalty **+1 EXD** | 0 | — |
| **Jan 19** | `cashback` settlement | только Loyalty **+1** | 0 | +5 USD |
| **Jan 11–24** | Ещё сделки #2001–#2002 | Loyalty **+2.0** | 0 | — |
| **Jan 24** EOD | `reward_activation` | ∅ | **2.0** | +Loyalty +2.0 |

*Числа согласованы с разделами 2–10; gift вставлен между активацией и transfer для проверки фильтров и кошелька.*

---

## 13. Цикл (для логики и онбординга)

```text
Trade
  → Loyalty lines в Upcoming (по сделкам, агрегат пачки)
  → reward_activation → Available EXD + запись в Activity (при необходимости сразу adjustment в тот же день)
  → (optional) special_reward
  → transfer → EXD на торговом счёте
  → сделка с rebate → EXD → Cashback + новый loyalty в Upcoming
  → cashback (день+) → USD на счёте + запись в Activity
  → снова накопление loyalty → следующая активация …
```

---

## 14. Чеклист для реализации в UI

- [ ] Пустое состояние: Upcoming / Available / лента согласованы с §0  
- [ ] Upcoming: отдельные карточки для **Loyalty** (EXD) и **Cashback pending** (USD)  
- [ ] Пачка loyalty: сумма = сумма ордеров; модалка — **Last 3 orders** + полный список  
- [ ] Лента: тип строки ↔ `system type` из §11; фильтры **Type** / **Date**  
- [ ] После `reward_activation` пачка исчезает из Upcoming и появляется одна строка в ленте  
- [ ] `cashback` снимает соответствующий pending в Upcoming  
- [ ] `special_reward` увеличивает Available и виден в ленте (и в демо-модалке при клике)

---

_Версия документа: под прототип reward activity (CE-3142). При смене бизнес-правил обновляй таблицы §1 и примеры §12._
