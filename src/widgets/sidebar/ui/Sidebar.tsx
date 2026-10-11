'use client';

import React, { useState } from 'react';
import { Search, X } from 'lucide-react';
import { Chat } from '@/entities/chat';
import { InstanceState } from '@/entities/session';
import { GreenApiCredentials } from '@/shared/api';
import { SidebarHeader } from './SidebarHeader';
import { ChatList } from './ChatList';

interface SidebarProps {
  chats: Chat[];
  activeChatId: string | null;
  onSelectChat: (id: string) => void;
  credentials: GreenApiCredentials | null;
  instanceState: InstanceState;
  isPolling: boolean;
  isLoading?: boolean;
  onOpenAuth: () => void;
  onOpenNewChat: () => void;
  onLogout: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  chats,
  activeChatId,
  onSelectChat,
  credentials,
  instanceState,
  isPolling,
  isLoading,
  onOpenAuth,
  onOpenNewChat,
  onLogout,
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredChats = chats.filter((c) => {
    const q = searchQuery.toLowerCase().trim();
    if (!q) return true;
    return (
      c.name.toLowerCase().includes(q) ||
      c.chatId.toLowerCase().includes(q) ||
      (c.lastMessage && c.lastMessage.toLowerCase().includes(q))
    );
  });

  return (
    <aside className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-white border-r border-black/6 shrink-0 select-none">
      <SidebarHeader
        credentials={credentials}
        instanceState={instanceState}
        isPolling={isPolling}
        isLoading={isLoading}
        onOpenAuth={onOpenAuth}
        onOpenNewChat={onOpenNewChat}
        onLogout={onLogout}
      />

      {/* Search Bar */}
      <div className="px-4 py-2.5">
        <div className="relative flex items-center">
          <Search className="w-4 h-4 text-[#060708]/40 absolute left-3.5 pointer-events-none" />
          <input
            type="text"
            placeholder="Поиск диалогов..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#f0f2f5] hover:bg-[#e9ebef] focus:bg-white text-sm text-[#060708] placeholder-[#060708]/40 rounded-xl pl-9 pr-8 py-2 border border-transparent focus:border-[#007aff]/30 focus:outline-none transition-all duration-150"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-2.5 p-1 text-[#060708]/40 hover:text-[#060708] rounded-full"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

     {!isLoading &&
      <ChatList
        chats={filteredChats}
        activeChatId={activeChatId}
        onSelectChat={onSelectChat}
        onOpenNewChat={onOpenNewChat}
      />}
    </aside>
  );
};
