'use client';

import React from 'react';
import { MessageSquarePlus } from 'lucide-react';
import { Chat } from '@/entities/chat';
import { ChatItem } from './ChatItem';

interface ChatListProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  onOpenNewChat: () => void;
}

export const ChatList: React.FC<ChatListProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  onOpenNewChat,
}) => {
  if (chats.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#060708]/50">
        <div className="w-12 h-12 rounded-2xl bg-[#f5f7fa] flex items-center justify-center text-[#060708]/30 mb-3">
          <MessageSquarePlus className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-[#060708]/80 mb-1">
          Нет активных диалогов
        </p>
        <p className="text-xs text-[#060708]/50 max-w-[200px] mb-4">
          Нажмите кнопку ниже, чтобы начать общение в MAX
        </p>
        <button
          onClick={onOpenNewChat}
          className="px-4 py-2 bg-[#007aff] hover:bg-[#006ee6] text-white text-xs font-medium rounded-xl transition-colors cursor-pointer shadow-sm"
        >
          Создать новый чат
        </button>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto py-2 divide-y divide-transparent">
      {chats.map((chat) => (
        <ChatItem
          key={chat.id}
          chat={chat}
          isActive={chat.id === activeChatId}
          onClick={() => onSelectChat(chat.id)}
        />
      ))}
    </div>
  );
};
