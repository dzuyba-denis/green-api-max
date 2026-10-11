'use client';

import React, { useRef, useEffect } from 'react';
import { SendHorizonal, Paperclip, Smile, AlertCircle } from 'lucide-react';
import { Spinner } from '@/shared/ui';

interface MessageInputProps {
  text: string;
  onChange: (value: string) => void;
  onSend: () => void;
  isSending: boolean;
  sendError?: string | null;
  placeholder?: string;
}

export const MessageInput: React.FC<MessageInputProps> = ({
  text,
  onChange,
  onSend,
  isSending,
  sendError,
  placeholder = 'Напишите сообщение...',
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-resize textarea height based on content up to 120px
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      const scrollHeight = textareaRef.current.scrollHeight;
      textareaRef.current.style.height = `${Math.min(scrollHeight, 120)}px`;
    }
  }, [text]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (text.trim() && !isSending) {
        onSend();
      }
    }
  };

  const handleEmojiClick = (emoji: string) => {
    onChange(text + emoji);
    textareaRef.current?.focus();
  };

  return (
    <div className="bg-white border-t border-black/[0.06] p-3 sm:px-4 flex flex-col gap-1.5 flex-shrink-0">
      {sendError && (
        <div className="flex items-center gap-1.5 px-3 py-1.5 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 mb-1">
          <AlertCircle className="w-4 h-4 flex-shrink-0" />
          <span className="truncate">{sendError}</span>
        </div>
      )}

      <div className="flex items-end gap-2">
        {/* Attachment button */}
        <button
          type="button"
          className="p-2.5 text-[#060708]/50 hover:text-[#060708]/80 hover:bg-[#f5f7fa] active:bg-[#edeef2] rounded-full transition-colors flex-shrink-0 cursor-pointer"
          title="Прикрепить файл"
          aria-label="Прикрепить файл"
        >
          <Paperclip className="w-5 h-5" />
        </button>

        {/* Input area */}
        <div className="flex-1 min-w-0 bg-[#f0f2f5] hover:bg-[#e9ebef] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#007aff]/20 focus-within:border-[#007aff] border border-transparent rounded-2xl transition-all flex items-center px-3.5 py-1.5">
          <textarea
            ref={textareaRef}
            rows={1}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={placeholder}
            disabled={isSending}
            className="w-full bg-transparent resize-none text-sm text-[#060708] placeholder-[#060708]/40 focus:outline-none leading-relaxed py-1 max-h-32"
          />

          <button
            type="button"
            onClick={() => handleEmojiClick('😊')}
            className="p-1.5 text-[#060708]/40 hover:text-[#060708]/70 rounded-full transition-colors flex-shrink-0 ml-1 cursor-pointer"
            title="Эмодзи"
            aria-label="Эмодзи"
          >
            <Smile className="w-5 h-5" />
          </button>
        </div>

        {/* Send button */}
        <button
          type="button"
          onClick={onSend}
          disabled={!text.trim() || isSending}
          className={`p-2.5 rounded-full transition-all duration-150 flex items-center justify-center flex-shrink-0 cursor-pointer ${
            text.trim() && !isSending
              ? 'bg-[#007aff] hover:bg-[#006ee6] active:bg-[#005ec4] text-white shadow-sm'
              : 'bg-[#f0f2f5] text-[#060708]/30 cursor-not-allowed'
          }`}
          title="Отправить сообщение (Enter)"
          aria-label="Отправить сообщение"
        >
          {isSending ? (
            <Spinner size="sm" color="currentColor" />
          ) : (
            <SendHorizonal className="w-5 h-5" />
          )}
        </button>
      </div>
    </div>
  );
};
