'use client';

import React from 'react';
import { ArrowLeft, MoreVertical, Shield } from 'lucide-react';
import { Chat } from '@/entities/chat';
import { Avatar } from '@/shared/ui';
import { formatChatIdDisplay } from '@/shared/lib/formatters';

interface ChatHeaderProps {
  chat: Chat;
  onBackMobile?: () => void;
}

export const ChatHeader: React.FC<ChatHeaderProps> = ({ chat, onBackMobile }) => {
  const subtitle = formatChatIdDisplay(chat.chatId);

  return (
    <header className="h-16 px-4 bg-white border-b border-black/6 flex items-center justify-between flex-shrink-0 z-10 select-none">
      <div className="flex items-center gap-3 min-w-0">
        {onBackMobile && (
          <button
            onClick={onBackMobile}
            className="md:hidden p-2 -ml-2 text-[#060708]/60 hover:text-[#060708] hover:bg-black/5 rounded-full"
            aria-label="Назад к списку чатов"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
        )}

        <Avatar name={chat.name || chat.chatId} size="md" online />

        <div className="flex flex-col min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="font-bold text-sm text-[#060708] truncate">
              {chat.name}
            </span>
          </div>
          <span className="text-xs text-[#060708]/50 truncate">
            {subtitle !== chat.name ? subtitle : 'в сети'}
          </span>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <div
          title="GREEN-API MAX соединение активно"
          className="hidden sm:flex items-center gap-1 text-[11px] text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200/50 font-medium"
        >
          <Shield className="w-3.5 h-3.5 text-emerald-600" />
          <span>MAX</span>
        </div>

        <button
          className="p-2 text-[#060708]/50 hover:text-[#060708] hover:bg-black/5 rounded-full transition-colors cursor-pointer"
          aria-label="Параметры чата"
        >
          <MoreVertical className="w-5 h-5" />
        </button>
      </div>
    </header>
  );
};
