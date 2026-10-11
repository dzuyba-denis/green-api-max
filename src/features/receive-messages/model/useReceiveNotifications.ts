'use client';

import { useEffect, useRef, useState } from 'react';
import { GreenApiCredentials, GreenApiClient } from '@/shared/api';
import { Chat } from '@/entities/chat';
import { Message } from '@/entities/message';
import { normalizeChatId, formatChatIdDisplay } from '@/shared/lib/formatters';
import { NOTIFICATION_POLL_INTERVAL_MS, RECEIVE_TIMEOUT_SECONDS } from '@/shared/config/constants';

interface UseReceiveNotificationsProps {
  credentials: GreenApiCredentials | null;
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>;
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>;
}

export function useReceiveNotifications({
  credentials,
  setChats,
  setMessages,
}: UseReceiveNotificationsProps) {
  // const [isPolling, setIsPolling] = useState(false);
  const isPolling = Boolean(credentials && credentials.idInstance && credentials.apiTokenInstance);
  const [lastReceivedTime, setLastReceivedTime] = useState<number | null>(null);
  const [pollingError, setPollingError] = useState<string | null>(null);

  // Keep ref to avoid stale closures inside loop
  const credentialsRef = useRef(credentials);

  useEffect(() => {
    if (!credentials || !credentials.idInstance || !credentials.apiTokenInstance) {
      return;
    }

    let isMounted = true;

    const pollLoop = async () => {
      while (isMounted && credentialsRef.current) {
        try {
          const currentCreds = credentialsRef.current;
          if (!currentCreds) break;

          // Step 1: Receive notification from queue
          const notification = await GreenApiClient.receiveNotification(
            currentCreds,
            RECEIVE_TIMEOUT_SECONDS
          );

          if (!isMounted) break;

          if (notification && notification.body) {
            const { receiptId, body } = notification;
            setLastReceivedTime(Date.now());

            // Handle incoming text message
            if (body.typeWebhook === 'incomingMessageReceived' && body.messageData) {
              const text =
                body.messageData.textMessageData?.textMessage ||
                body.messageData.extendedTextMessageData?.text;

              if (text) {
                const rawChatId =
                  body.senderData?.chatId ||
                  (body.senderData?.senderPhoneNumber ? `${body.senderData.senderPhoneNumber}@c.us` : '');

                const normalizedChatId = normalizeChatId(rawChatId);
                const senderName =
                  body.senderData?.chatName ||
                  body.senderData?.senderName ||
                  body.senderData?.senderContactName ||
                  formatChatIdDisplay(normalizedChatId);

                const msgTimestamp = body.timestamp
                  ? body.timestamp * 1000
                  : Date.now();

                const incomingMessage: Message = {
                  id: body.idMessage || `inc_${Date.now()}_${receiptId}`,
                  chatId: normalizedChatId,
                  sender: 'recipient',
                  senderName,
                  text,
                  timestamp: msgTimestamp,
                  status: 'read',
                };

                // Update messages state
                setMessages((prev) => {
                  const existingList = prev[normalizedChatId] || [];
                  // Deduplicate by message ID
                  if (existingList.some((m) => m.id === incomingMessage.id)) {
                    return prev;
                  }
                  return {
                    ...prev,
                    [normalizedChatId]: [...existingList, incomingMessage],
                  };
                });

                // Ensure chat exists in chats list
                setChats((prev) => {
                  const chatIndex = prev.findIndex((c) => c.id === normalizedChatId || c.chatId === normalizedChatId);
                  if (chatIndex >= 0) {
                    const updated = [...prev];
                    updated[chatIndex] = {
                      ...updated[chatIndex],
                      lastMessage: text,
                      lastMessageTimestamp: msgTimestamp,
                    };
                    return updated;
                  } else {
                    const newChat: Chat = {
                      id: normalizedChatId,
                      chatId: normalizedChatId,
                      name: senderName,
                      lastMessage: text,
                      lastMessageTimestamp: msgTimestamp,
                      createdAt: msgTimestamp,
                    };
                    return [newChat, ...prev];
                  }
                });
              }
            }

            // Handle status updates for sent messages (delivered, read)
            if (body.typeWebhook === 'outgoingMessageStatus' && body.idMessage && body.status) {
              const targetMsgId = body.idMessage;
              const newStatus = body.status;

              setMessages((prev) => {
                let changed = false;
                const nextState: Record<string, Message[]> = {};

                for (const [chatId, list] of Object.entries(prev)) {
                  nextState[chatId] = list.map((m) => {
                    if (m.id === targetMsgId) {
                      changed = true;
                      return {
                        ...m,
                        status: newStatus as Message['status'],
                      };
                    }
                    return m;
                  });
                }

                return changed ? nextState : prev;
              });
            }

            // Step 2: Delete notification from queue (acknowledge receipt FIFO)
            await GreenApiClient.deleteNotification(currentCreds, receiptId);

            // Immediately poll next notification in queue without extra delay
            continue;
          }

          // Queue was empty or timed out, wait before next check
          await new Promise((res) => setTimeout(res, NOTIFICATION_POLL_INTERVAL_MS));
        } catch (err: unknown) {
          if (!isMounted) break;
          const msg = err instanceof Error ? err.message : 'Ошибка при получении уведомлений';
          console.warn('Notification polling error:', msg);
          setPollingError(msg);

          // Wait 3 seconds on error before retrying
          await new Promise((res) => setTimeout(res, 3000));
        }
      }
    };

    pollLoop();  

    return () => {
      isMounted = false;
    };
  }, [credentials, setChats, setMessages]);

  return {
    isPolling,
    lastReceivedTime,
    pollingError,
  };
}
