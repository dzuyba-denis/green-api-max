/**
 * Formats unix timestamp (seconds or milliseconds) or Date object to HH:mm
 */
export function formatTime(timestamp: number | Date): string {
  const date = typeof timestamp === 'number'
    ? new Date(timestamp > 1e11 ? timestamp : timestamp * 1000)
    : timestamp;

  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

/**
 * Formats message timestamp for chat list (time if today, 'Вчера', or date)
 */
export function formatChatListDate(timestamp: number | Date): string {
  const date = typeof timestamp === 'number'
    ? new Date(timestamp > 1e11 ? timestamp : timestamp * 1000)
    : timestamp;

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) {
    return formatTime(date);
  }

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) {
    return 'Вчера';
  }

  return date.toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' });
}

/**
 * Returns date header label for message grouping ("Сегодня", "Вчера", or "10 октября")
 */
export function formatDateDivider(timestamp: number | Date): string {
  const date = typeof timestamp === 'number'
    ? new Date(timestamp > 1e11 ? timestamp : timestamp * 1000)
    : timestamp;

  const now = new Date();
  const isToday =
    date.getDate() === now.getDate() &&
    date.getMonth() === now.getMonth() &&
    date.getFullYear() === now.getFullYear();

  if (isToday) return 'Сегодня';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  const isYesterday =
    date.getDate() === yesterday.getDate() &&
    date.getMonth() === yesterday.getMonth() &&
    date.getFullYear() === yesterday.getFullYear();

  if (isYesterday) return 'Вчера';

  return date.toLocaleDateString('ru-RU', {
    day: 'numeric',
    month: 'long',
    year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined,
  });
}
