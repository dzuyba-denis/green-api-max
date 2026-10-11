export interface Chat {
  id: string; // usually the normalized chatId
  chatId: string; // e.g. 79991234567@c.us or 10000000
  name: string; // display title (e.g. phone formatted or contact name)
  lastMessage?: string;
  lastMessageTimestamp?: number;
  unreadCount?: number;
  createdAt: number;
}
