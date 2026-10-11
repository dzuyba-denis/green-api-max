'use client';

import React from 'react';
import { Chat } from '@/entities/chat';
import { Avatar } from '@/shared/ui';
import { formatChatListDate } from '@/shared/lib/date';

interface ChatItemProps {
  chat: Chat;
  isActive: boolean;
  onClick: () => void;
}

export const ChatItem: React.FC<ChatItemProps> = ({
  chat,
  isActive,
  onClick,
}) => {
  const timeFormatted = chat.lastMessageTimestamp
    ? formatChatListDate(chat.lastMessageTimestamp)
    : '';

  return (
    <div
      onClick={onClick}
      className={`group flex items-center gap-3 px-3.5 py-3 cursor-pointer select-none transition-colors duration-150 rounded-xl mx-2 ${
        isActive
          ? 'bg-[#e7f3ff] text-[#060708]'
          : 'hover:bg-[#f5f7fa] text-[#060708]'
      }`}
    >
      <Avatar name={chat.name || chat.chatId} size="md" />

      <div className="flex-1 min-w-0 flex flex-col justify-center">
        <div className="flex items-center justify-between gap-1 mb-0.5">
          <span className="font-semibold text-sm truncate text-[#060708]">
            {chat.name}
          </span>
          {timeFormatted && (
            <span
              className={`text-[11px] flex-shrink-0 ${
                isActive ? 'text-[#007aff] font-medium' : 'text-[#060708]/50'
              }`}
            >
              {timeFormatted}
            </span>
          )}
        </div>

        <div className="flex items-center justify-between gap-1">
          <p className="text-xs text-[#060708]/60 truncate font-normal">
            {chat.lastMessage || 'Нет сообщений'}
          </p>
        </div>
      </div>
    </div>
  );
};
