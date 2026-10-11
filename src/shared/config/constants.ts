export const DEFAULT_API_URL =
  process.env.NEXT_PUBLIC_GREEN_API_URL || 'https://api.green-api.com';

export const DEFAULT_ID_INSTANCE = process.env.NEXT_PUBLIC_DEFAULT_ID_INSTANCE;

export const DEFAULT_API_TOKEN_INSTANCE = process.env.NEXT_PUBLIC_DEFAULT_API_TOKEN_INSTANCE;

export const NOTIFICATION_POLL_INTERVAL_MS = Number(
  process.env.NEXT_PUBLIC_NOTIFICATION_POLL_INTERVAL_MS || 2000
);

export const RECEIVE_TIMEOUT_SECONDS = Number(
  process.env.NEXT_PUBLIC_RECEIVE_TIMEOUT_SECONDS || 5
);

export const STORAGE_KEYS = {
  CREDENTIALS: 'green_max_credentials',
  CHATS: 'green_max_chats',
  MESSAGES: 'green_max_messages',
  ACTIVE_CHAT_ID: 'green_max_active_chat_id',
} as const;
