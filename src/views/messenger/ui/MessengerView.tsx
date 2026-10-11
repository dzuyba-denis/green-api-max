'use client';

import React, { useState, useEffect } from 'react';
import { Sidebar } from '@/widgets/sidebar';
import { ChatArea } from '@/widgets/chat-area';
import { AuthModal } from '@/widgets/auth-modal';
import { NewChatModal } from '@/widgets/new-chat-modal';
import { useAuthInstance } from '@/features/auth-by-instance';
import { useCreateChat } from '@/features/create-chat';
import { useSendMessage } from '@/features/send-message';
import { useReceiveNotifications } from '@/features/receive-messages';
import { Chat } from '@/entities/chat';
import { Message } from '@/entities/message';
import { safeLocalStorage } from '@/shared/lib/storage';
import { STORAGE_KEYS } from '@/shared/config/constants';

export const MessengerView: React.FC = () => {
  // Auth & Session
  const {
    credentials,
    instanceState,
    isLoading: isAuthLoading,
    isInitialized: isAuthInitialized,
    error: authError,
    login,
    logout,
  } = useAuthInstance();

  // Chats state
  const [chats, setChats] = useState<Chat[]>([]);

  // Active chat ID state
  const [activeChatId, setActiveChatId] = useState<string | null>(null);

  // Messages state: mapped by chatId
  const [messages, setMessages] = useState<Record<string, Message[]>>({});
  const [isStorageInitialized, setIsStorageInitialized] = useState(false);

  // Restore browser-only state after the server and client have rendered the same initial UI.
  /* eslint-disable react-hooks/set-state-in-effect -- Restore persisted browser state after hydration. */
  useEffect(() => {
    setChats(safeLocalStorage.getItem<Chat[]>(STORAGE_KEYS.CHATS, []));
    setActiveChatId(
      safeLocalStorage.getItem<string | null>(STORAGE_KEYS.ACTIVE_CHAT_ID, null)
    );
    setMessages(
      safeLocalStorage.getItem<Record<string, Message[]>>(STORAGE_KEYS.MESSAGES, {})
    );
    setIsStorageInitialized(true);
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Modal states: open automatically after saved credentials have been restored.
  const [isAuthModalManuallyOpen, setIsAuthModalManuallyOpen] = useState(false);
  const [hasDismissedInitialAuthModal, setHasDismissedInitialAuthModal] =
    useState(false);
  const isAuthModalOpen =
    isAuthModalManuallyOpen ||
    (isAuthInitialized && !credentials && !hasDismissedInitialAuthModal);

  const closeAuthModal = () => {
    setIsAuthModalManuallyOpen(false);
    setHasDismissedInitialAuthModal(true);
  };

  // Sync state to localStorage only after the saved state has been restored.
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
  }, [isStorageInitialized, messages]);

  // Create Chat Feature
  const {
    isOpen: isNewChatOpen,
    openModal: openNewChatModal,
    closeModal: closeNewChatModal,
    createChat,
    error: createChatError,
  } = useCreateChat(chats, setChats, setActiveChatId);

  // Active chat object
  const activeChat = chats.find((c) => c.id === activeChatId) || null;
  const activeMessages = activeChatId ? messages[activeChatId] || [] : [];

  // Send Message Feature
  const {
    inputText,
    setInputText,
    isSending,
    sendError,
    sendMessage,
  } = useSendMessage(credentials, activeChat, setMessages, setChats);

  // Receive Notifications Background Poller
  const { isPolling } = useReceiveNotifications({
    credentials,
    setChats,
    setMessages,
  });

  return (
    <div className="w-full h-screen flex overflow-hidden bg-[#edeef2] text-[#060708] font-sans antialiased">
      {/* Sidebar: on mobile, hidden if a chat is actively open */}
      <div
        className={`${
          activeChat ? 'hidden md:flex' : 'flex'
        } w-full md:w-auto h-full shrink-0`}
      >
        <Sidebar
          chats={chats}
          activeChatId={activeChatId}
          onSelectChat={(id) => setActiveChatId(id)}
          credentials={credentials}
          instanceState={instanceState}
          isPolling={isPolling}
          isLoading={isAuthLoading}
          onOpenAuth={() => setIsAuthModalManuallyOpen(true)}
          onOpenNewChat={openNewChatModal}
          onLogout={() => {
            logout();
            setIsAuthModalManuallyOpen(true);
          }}
        />
      </div>

      {/* Main Chat Area: on mobile, hidden if no chat is open */}
      <div
        className={`${
          !activeChat ? 'hidden md:flex' : 'flex'
        } flex-1 h-full min-w-0`}
      >
        <ChatArea
          activeChat={activeChat}
          messages={activeMessages}
          inputText={inputText}
          onInputChange={setInputText}
          onSendMessage={() => sendMessage()}
          isSending={isSending}
          sendError={sendError}
          onOpenNewChat={openNewChatModal}
          onBackMobile={() => setActiveChatId(null)}
        />
      </div>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={closeAuthModal}
        currentCredentials={credentials}
        onSave={login}
        isLoading={isAuthLoading}
        error={authError}
      />

      {/* New Chat Modal */}
      <NewChatModal
        isOpen={isNewChatOpen}
        onClose={closeNewChatModal}
        onCreate={(phone, name) => createChat(phone, name)}
        error={createChatError}
      />
    </div>
  );
};
