# Frontend (Vite + Vue 3)

## Переменные окружения
Создайте файл `.env` (или используйте готовый пример `.env.example`) в корне `frontend/`:
```
VITE_API_BASE_URL=http://localhost:8000
VITE_TELEGRAM_BOT=app_messeger_bot
```
`VITE_API_BASE_URL` — адрес бекенда; `VITE_TELEGRAM_BOT` — username бота без `@`.

## Установка и запуск
```sh
cd frontend
npm install
npm run dev -- --host --port 5173
```

## Сборка
```sh
npm run build
```
