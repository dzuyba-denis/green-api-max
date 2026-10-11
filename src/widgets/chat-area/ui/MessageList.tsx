'use client';

import React, { useEffect, useRef } from 'react';
import { Message } from '@/entities/message';
import { MessageBubble } from '@/entities/message';
import { formatDateDivider } from '@/shared/lib/date';
import { MessageSquareDashed } from 'lucide-react';

interface MessageListProps {
  messages: Message[];
}

export const MessageList: React.FC<MessageListProps> = ({ messages }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-[#060708]/40">
        <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center text-[#060708]/30 mb-2.5">
          <MessageSquareDashed className="w-6 h-6" />
        </div>
        <p className="text-sm font-medium text-[#060708]/70">В этом диалоге пока нет сообщений</p>
        <p className="text-xs text-[#060708]/50 mt-1">
          Напишите первое текстовое сообщение ниже
        </p>
      </div>
    );
  }

  // Group messages by date string
  const grouped: { dateLabel: string; items: Message[] }[] = [];
  let currentDate = '';
  let currentGroup: Message[] = [];

  messages.forEach((msg) => {
    const divider = formatDateDivider(msg.timestamp);
    if (divider !== currentDate) {
      if (currentGroup.length > 0) {
        grouped.push({ dateLabel: currentDate, items: currentGroup });
      }
      currentDate = divider;
      currentGroup = [msg];
    } else {
      currentGroup.push(msg);
    }
  });

  if (currentGroup.length > 0) {
    grouped.push({ dateLabel: currentDate, items: currentGroup });
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
      {grouped.map((group, groupIdx) => (
        <div key={groupIdx} className="flex flex-col">
          {/* Date Divider Chip */}
          <div className="flex justify-center my-3 select-none">
            <span className="px-3 py-1 bg-white/80 backdrop-blur-xs border border-black/[0.04] rounded-full text-[11px] font-medium text-[#060708]/60 shadow-xs">
              {group.dateLabel}
            </span>
          </div>

          {/* Messages in this date */}
          {group.items.map((message) => (
            <MessageBubble key={message.id} message={message} />
          ))}
        </div>
      ))}
      <div ref={bottomRef} />
    </div>
  );
};
