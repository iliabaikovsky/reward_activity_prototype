# Деплой прототипа на Vercel

Команды ниже выполняй **в корне скопированного проекта**, после `npm install`.

## Vercel CLI (удобно для быстрых итераций)

```bash
# один раз на машине
npx vercel login

# из корня проекта (где package.json)
npm run build
npm run deploy
```

`vercel.json` уже задаёт `framework: vite`, `outputDirectory: dist` и SPA-fallback на `index.html`.

## Через сайт Vercel

1. Открой [vercel.com](https://vercel.com) → **Add New Project**
2. Импорт из Git **или** загрузка папки
3. **Root Directory** — эта папка шаблона (если репозиторий монорепо)
4. Build: `npm run build`, Output: `dist` (обычно определяется автоматически)
5. Deploy

## Автодеплой при push с локалки (Git → Vercel)

Цель: сделал коммит и `git push` — Vercel сам собирает и выкатывает (без `npm run deploy` каждый раз).

### Если проект уже есть на Vercel (как у `reward-activity`)

1. Зайди в [Vercel Dashboard](https://vercel.com/dashboard) → свой проект → **Settings** → **Git**.
2. **Connect Git Repository** → выбери **GitHub** и репозиторий (например `iliabaikovsky/reward_activity_prototype`).
3. **Production Branch** — обычно `main`.
4. Сохрани. Дальше каждый **push в `main`** = production; push в другие ветки / PR = preview URL.

### Если проекта ещё нет

1. **Add New… → Project** → Import репозитория с GitHub.
2. Build / Output подхватятся из `vercel.json` (`npm run build`, `dist`).

### Локальный цикл

```bash
git add -A
git commit -m "описание"
git push origin main
```

Через минуту обновится прод (например `reward-activity.vercel.app`). Статус сборки — в Vercel → **Deployments**.

**Не включай** одновременно этот Git-интеграл и отдельный GitHub Action с `vercel deploy` на тот же проект — получатся дубли деплоев.

## Заметки

- Папку `.vercel` в git обычно не коммитят (она в `.gitignore`) — на каждой машине можно заново привязать `vercel link`.
- Preview-деплои создаются на каждый push, если проект подключён к GitHub/GitLab.
