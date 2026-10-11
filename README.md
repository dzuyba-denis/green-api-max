# MAX Web Messenger (GREEN-API Integration)

Пользовательский веб-интерфейс мессенджера в визуальном стиле [web.max.ru](https://web.max.ru/) для отправки и получения текстовых сообщений через сервис [GREEN-API (MAX API)](https://green-api.com/max).

Реализовано в рамках тестового задания на позицию «Фронтенд разработчик React».

---

## Архитектура: Feature-Sliced Design (FSD)

Проект спроектирован по методологии **Feature-Sliced Design (v2)**:

```
src/
├── app/                  # Next.js App Router (Layout, Page, Global CSS, API Proxy)
│   └── api/green-api/    # Серверный прокси для исключения проблем с CORS в браузере
├── views/                # Композиция страниц (MessengerView)
├── widgets/              # Крупные самодостаточные UI-блоки
│   ├── sidebar/          # Сайдбар с поиском, списком чатов и статусом инстанса
│   ├── chat-area/        # Окно чата (заголовок, лента сообщений, поле ввода)
│   ├── auth-modal/       # Модальное окно авторизации (idInstance / apiTokenInstance)
│   └── new-chat-modal/   # Модальное окно создания диалога по номеру получателя
├── features/             # Пользовательские сценарии и взаимодействия
│   ├── auth-by-instance/ # Управление авторизацией, валидация и сохранение в localStorage
│   ├── create-chat/      # Создание нового чата, нормализация номеров телефонов
│   ├── send-message/     # Отправка сообщений через SendMessage API с оптимистичным UI
│   └── receive-messages/ # Фоновый поллер ReceiveNotification -> DeleteNotification (FIFO)
├── entities/             # Бизнес-сущности и модели предметной области
│   ├── session/          # Состояние инстанса и подключение
│   ├── chat/             # Модель диалога, метаданные
│   └── message/          # Модель сообщения, рендеринг бабблов (MessageBubble)
└── shared/               # Переиспользуемые утилиты, базовые UI-компоненты и API
    ├── api/              # Клиент GreenApiClient (типизированный)
    ├── config/           # Константы и конфигурация
    ├── lib/              # Форматирование дат, телефонных номеров, безопасный localStorage
    └── ui/               # Button, Input, Modal, Avatar, Spinner
```

---

## Выполнение требований тестового задания

1. **Интерфейс для отправки и получения сообщений в MAX**:
   - Полная интеграция с сервисом [GREEN-API MAX](https://green-api.com/max).
2. **Только текстовые сообщения**:
   - Реализована отправка и получение текста с поддержкой эмодзи, форматированием и переносами строк.
3. **Прототип интерфейса — `https://web.max.ru/`**:
   - Применены оригинальные дизайн-токены: цвет холста `#edeef2`, белые карточки `#ffffff`, бабблы входящих сообщений `#ffffff`, исходящие сообщения в фирменном голубом оттенке `#e9fdff`, акцентный синий `#007aff` / `#016fe7`.
4. **Метод отправки сообщений**:
   - `POST {{apiUrl}}/waInstance{{idInstance}}/sendMessage/{{apiTokenInstance}}` в соответствии с [документацией SendMessage](https://green-api.com/v3/docs/api/sending/SendMessage/).
5. **Метод получения сообщений (HTTP API)**:
   - В соответствии с [документацией Technology HTTP API](https://green-api.com/v3/docs/api/receiving/technology-http-api/):
     - `GET {{apiUrl}}/waInstance{{idInstance}}/receiveNotification/{{apiTokenInstance}}?receiveTimeout=5`
     - Обработка `incomingMessageReceived` и статусов доставки/прочтения `outgoingMessageStatus`.
     - `DELETE {{apiUrl}}/waInstance{{idInstance}}/deleteNotification/{{apiTokenInstance}}/{{receiptId}}` — подтверждение обработки и удаление из очереди FIFO.
6. **Пользовательский сценарий**:
   - При первом входе открывается диалог ввода учетных данных (`idInstance`, `apiTokenInstance`, опционально `apiUrl`).
   - Кнопка «Новый чат» позволяет ввести номер телефона или ID получателя.
   - Отправленное сообщение мгновенно появляется в чате (оптимистичный UI) со статусом доставки.
   - Входящий ответ собеседника из мессенджера MAX автоматически доставляется и отображается в диалоге в реальном времени.

---

## Запуск проекта

### 1. Установка зависимостей
```bash
npm install
```

### 2. Настройка переменных окружения
Скопируйте пример файла конфигурации:
```bash
cp .env.example .env
```
При необходимости укажите параметры в `.env`:
- `NEXT_PUBLIC_GREEN_API_URL` — базовый адрес API (по умолчанию `https://api.green-api.com` или адрес вашего инстанса);
- `NEXT_PUBLIC_DEFAULT_ID_INSTANCE` и `NEXT_PUBLIC_DEFAULT_API_TOKEN_INSTANCE` — учетные данные для автозаполнения в форме авторизации (необязательно);
- `NEXT_PUBLIC_RECEIVE_TIMEOUT_SECONDS` — таймаут ожидания уведомлений в секундах (по умолчанию 5);
- `NEXT_PUBLIC_NOTIFICATION_POLL_INTERVAL_MS` — интервал между запросами к очереди в миллисекундах (по умолчанию 2000).

### 3. Запуск в режиме разработки
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000) в браузере.

### 4. Сборка для продакшена
```bash
npm run build
npm run start
```
