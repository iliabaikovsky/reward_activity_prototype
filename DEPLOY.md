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

## Заметки

- Папку `.vercel` в git обычно не коммитят (она в `.gitignore`) — на каждой машине можно заново привязать `vercel link`.
- Preview-деплои создаются на каждый push, если проект подключён к GitHub/GitLab.
