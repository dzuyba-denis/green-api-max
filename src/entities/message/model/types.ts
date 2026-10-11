export type MessageStatus = 'sending' | 'sent' | 'delivered' | 'read' | 'failed';

export interface Message {
  id: string;
  chatId: string;
  sender: 'user' | 'recipient';
  senderName?: string;
  text: string;
  timestamp: number;
  status: MessageStatus;
}
