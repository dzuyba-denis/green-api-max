'use client';

import React from 'react';
import { Chat } from '@/entities/chat';
import { Message } from '@/entities/message';
import { ChatHeader } from './ChatHeader';
import { MessageList } from './MessageList';
import { MessageInput } from './MessageInput';
import { EmptyChatPlaceholder } from './EmptyChatPlaceholder';

interface ChatAreaProps {
  activeChat: Chat | null;
  messages: Message[];
  inputText: string;
  onInputChange: (val: string) => void;
  onSendMessage: () => void;
  isSending: boolean;
  sendError: string | null;
  onOpenNewChat: () => void;
  onBackMobile?: () => void;
}

export const ChatArea: React.FC<ChatAreaProps> = ({
  activeChat,
  messages,
  inputText,
  onInputChange,
  onSendMessage,
  isSending,
  sendError,
  onOpenNewChat,
  onBackMobile,
}) => {
  if (!activeChat) {
    return <EmptyChatPlaceholder onOpenNewChat={onOpenNewChat} />;
  }

  return (
    <main className="flex-1 h-full flex flex-col bg-[#edeef2] min-w-0 overflow-hidden relative">
      <ChatHeader chat={activeChat} onBackMobile={onBackMobile} />
      <MessageList messages={messages} />
      <MessageInput
        text={inputText}
        onChange={onInputChange}
        onSend={onSendMessage}
        isSending={isSending}
        sendError={sendError}
      />
    </main>
  );
};
