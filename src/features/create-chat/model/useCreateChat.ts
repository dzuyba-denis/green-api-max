'use client';

import { useState, useCallback } from 'react';
import { Chat } from '@/entities/chat';
import { normalizeChatId, formatChatIdDisplay } from '@/shared/lib/formatters';

export function useCreateChat(
  chats: Chat[],
  setChats: React.Dispatch<React.SetStateAction<Chat[]>>,
  setActiveChatId: (id: string) => void
) {
  const [isOpen, setIsOpen] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState('');
  const [customName, setCustomName] = useState('');
  const [error, setError] = useState<string | null>(null);

  const openModal = useCallback(() => {
    setPhoneNumber('');
    setCustomName('');
    setError(null);
    setIsOpen(true);
  }, []);

  const closeModal = useCallback(() => {
    setIsOpen(false);
    setError(null);
  }, []);

  const createChat = useCallback(
    (inputPhone: string, name?: string): Chat | null => {
      const normalized = normalizeChatId(inputPhone);
      if (!normalized) {
        setError('Введите корректный номер телефона или идентификатор получателя');
        return null;
      }

      // Check if chat already exists
      const existing = chats.find(
        (c) => c.chatId === normalized || c.id === normalized
      );
      if (existing) {
        setActiveChatId(existing.id);
        closeModal();
        return existing;
      }

      const displayTitle = name?.trim() || formatChatIdDisplay(normalized);

      const newChat: Chat = {
        id: normalized,
        chatId: normalized,
        name: displayTitle,
        createdAt: Date.now(),
      };

      setChats((prev) => [newChat, ...prev]);
      setActiveChatId(newChat.id);
      closeModal();
      return newChat;
    },
    [chats, setChats, setActiveChatId, closeModal]
  );

  return {
    isOpen,
    phoneNumber,
    customName,
    error,
    setPhoneNumber,
    setCustomName,
    openModal,
    closeModal,
    createChat,
  };
}
