'use client';

import { useState, useEffect, useCallback, useMemo } from 'react';
import { Chat } from '@/entities/chat';
import { Message } from '@/entities/message';
import { safeLocalStorage } from '@/shared/lib/storage';
import { STORAGE_KEYS } from '@/shared/config/constants';

export function useMessengerState() {
  const [chats, setChats] = useState<Chat[]>([]);
  const [activeChatId, setActiveChatId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);

  // Restore persisted state from browser storage
  /* eslint-disable react-hooks/set-state-in-effect -- Restore persisted browser state after hydration. */
  useEffect(() => {
    const storedChats = safeLocalStorage.getItem<Chat[]>(STORAGE_KEYS.CHATS, []);
    const storedActiveId = safeLocalStorage.getItem<string | null>(
      STORAGE_KEYS.ACTIVE_CHAT_ID,
      null
    );
    const storedMessages = safeLocalStorage.getItem<Record<string, Message[]>>(
      STORAGE_KEYS.MESSAGES,
      {}
    );

    setChats(storedChats);
    setActiveChatId(storedActiveId);
    setMessages(storedMessages);
    setIsStorageInitialized(true);
  }, []);

  // Sync to storage after hydration
  useEffect(() => {
    if (!isStorageInitialized) return;
    safeLocalStorage.setItem(STORAGE_KEYS.CHATS, chats);
  }, [chats, isStorageInitialized]);

  useEffect(() => {
    if (!isStorageInitialized) return;
    safeLocalStorage.setItem(STORAGE_KEYS.ACTIVE_CHAT_ID, activeChatId);
  }, [activeChatId, isStorageInitialized]);

  useEffect(() => {
    if (!isStorageInitialized) return;
    safeLocalStorage.setItem(STORAGE_KEYS.MESSAGES, messages);
  }, [messages, isStorageInitialized]);

  // Derived state
  const activeChat = useMemo(
    () => chats.find((c) => c.id === activeChatId) || null,
    [chats, activeChatId]
  );

  const activeMessages = useMemo(
    () => (activeChatId ? messages[activeChatId] || [] : []),
    [messages, activeChatId]
  );

  // Actions
  const deleteChat = useCallback(
    (chatId: string) => {
      setChats((prev) => prev.filter((c) => c.id !== chatId && c.chatId !== chatId));
      setMessages((prev) => {
        const next = { ...prev };
        delete next[chatId];
        return next;
      });
      setActiveChatId((currentId) => (currentId === chatId ? null : currentId));
    },
    []
  );

  const clearChatMessages = useCallback((chatId: string) => {
    setMessages((prev) => ({
      ...prev,
      [chatId]: [],
    }));
    setChats((prev) =>
      prev.map((c) =>
        c.id === chatId || c.chatId === chatId
          ? { ...c, lastMessage: undefined, lastMessageTimestamp: undefined }
          : c
      )
    );
  }, []);

  const clearAllData = useCallback(() => {
    setChats([]);
    setActiveChatId(null);
    setMessages({});
    safeLocalStorage.removeItem(STORAGE_KEYS.CHATS);
    safeLocalStorage.removeItem(STORAGE_KEYS.ACTIVE_CHAT_ID);
    safeLocalStorage.removeItem(STORAGE_KEYS.MESSAGES);
  }, []);

  return {
    chats,
    setChats,
    activeChatId,
    setActiveChatId,
    activeChat,
    messages,
    setMessages,
    activeMessages,
    isStorageInitialized,
    deleteChat,
    clearChatMessages,
    clearAllData,
  };
}
