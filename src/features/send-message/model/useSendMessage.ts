'use client';

import { useState, useCallback } from 'react';
import { GreenApiCredentials, GreenApiClient } from '@/shared/api';
import { Message } from '@/entities/message';
import { Chat } from '@/entities/chat';

export function useSendMessage(
  credentials: GreenApiCredentials | null,
  activeChat: Chat | null,
  setMessages: React.Dispatch<React.SetStateAction<Record<string, Message[]>>>,
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>
) {
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const sendMessage = useCallback(
    async (textToSend?: string) => {
      const text = (textToSend ?? inputText).trim();
      if (!text || !activeChat || !credentials) return;

      setIsSending(true);
      setSendError(null);

      const tempId = `temp_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
      const now = Date.now();

      const optimisticMessage: Message = {
        id: tempId,
        chatId: activeChat.chatId,
        sender: 'user',
        text,
        timestamp: now,
        status: 'sending',
      };

      // Optimistically append message
      setMessages((prev) => {
        const chatMessages = prev[activeChat.id] || [];
        return {
          ...prev,
          [activeChat.id]: [...chatMessages, optimisticMessage],
        };
      });

      // Update chat last message
      setChats((prev) =>
        prev.map((c) =>
          c.id === activeChat.id
            ? {
                ...c,
                lastMessage: text,
                lastMessageTimestamp: now,
              }
            : c
        )
      );

      setInputText('');

      try {
        const response = await GreenApiClient.sendMessage(credentials, {
          chatId: activeChat.chatId,
          message: text,
        });

        // Update message status to 'sent' and set real idMessage
        setMessages((prev) => {
          const chatMessages = prev[activeChat.id] || [];
          return {
            ...prev,
            [activeChat.id]: chatMessages.map((m) =>
              m.id === tempId
                ? {
                    ...m,
                    id: response.idMessage || tempId,
                    status: 'sent',
                  }
                : m
            ),
          };
        });
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : 'Ошибка отправки сообщения';
        setSendError(message);

        // Mark message as failed
        setMessages((prev) => {
          const chatMessages = prev[activeChat.id] || [];
          return {
            ...prev,
            [activeChat.id]: chatMessages.map((m) =>
              m.id === tempId
                ? {
                    ...m,
                    status: 'failed',
                  }
                : m
            ),
          };
        });
      } finally {
        setIsSending(false);
      }
    },
    [activeChat, credentials, inputText, setMessages, setChats]
  );

  return {
    inputText,
    setInputText,
    isSending,
    sendError,
    sendMessage,
  };
}
