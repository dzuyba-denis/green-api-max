'use client';

import React from 'react';
import { Check, CheckCheck, Clock, AlertCircle } from 'lucide-react';
import { Message } from '../model/types';
import { formatTime } from '@/shared/lib/date';

interface MessageBubbleProps {
  message: Message;
}

export const MessageBubble: React.FC<MessageBubbleProps> = ({ message }) => {
  const isOutgoing = message.sender === 'user';
  const timeFormatted = formatTime(message.timestamp);

  const renderStatus = () => {
    if (!isOutgoing) return null;

    switch (message.status) {
      case 'sending':
        return <Clock className="w-3.5 h-3.5 text-[#016fe7]/70 animate-pulse" />;
      case 'sent':
        return <Check className="w-3.5 h-3.5 text-[#016fe7]" />;
      case 'delivered':
      case 'read':
        return <CheckCheck className="w-4 h-4 text-[#016fe7]" />;
      case 'failed':
        return <AlertCircle className="w-3.5 h-3.5 text-red-500" />;
      default:
        return <Check className="w-3.5 h-3.5 text-[#016fe7]" />;
    }
  };

  return (
    <div
      className={`flex w-full mb-2 ${
        isOutgoing ? 'justify-end' : 'justify-start'
      }`}
    >
      <div
        className={`relative max-w-[80%] md:max-w-[70%] lg:max-w-[60%] px-3.5 py-2.5 shadow-sm text-sm transition-all ${
          isOutgoing
            ? 'bg-[#e9fdff] border border-[#cbeaf7] text-[#011c29] rounded-2xl rounded-br-xs'
            : 'bg-white border border-black/[0.04] text-[#011c29] rounded-2xl rounded-bl-xs'
        }`}
      >
        {/* Recipient name if incoming and available */}
        {!isOutgoing && message.senderName && (
          <div className="text-xs font-semibold text-[#007aff] mb-1 select-none">
            {message.senderName}
          </div>
        )}

        {/* Message text */}
        <p className="whitespace-pre-wrap break-words leading-relaxed select-text">
          {message.text}
        </p>

        {/* Timestamp and status indicator */}
        <div
          className={`flex items-center justify-end gap-1 mt-1 select-none text-[11px] ${
            isOutgoing ? 'text-[#016fe7]/80' : 'text-[#011c29]/50'
          }`}
        >
          <span>{timeFormatted}</span>
          {renderStatus()}
        </div>
      </div>
    </div>
  );
};
