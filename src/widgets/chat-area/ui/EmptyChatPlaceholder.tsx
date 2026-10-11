'use client';

import React from 'react';
import { MessageSquare, ShieldCheck, Zap } from 'lucide-react';
import { Button } from '@/shared/ui';

interface EmptyChatPlaceholderProps {
  onOpenNewChat: () => void;
}

export const EmptyChatPlaceholder: React.FC<EmptyChatPlaceholderProps> = ({
  onOpenNewChat,
}) => {
  return (
    <div className="flex-1 flex flex-col items-center justify-center p-8 text-center select-none bg-[#edeef2]/60">
      <div className="w-20 h-20 rounded-3xl bg-white shadow-md flex items-center justify-center mb-6 text-[#007aff] relative">
        <div className="absolute inset-0 bg-gradient-to-tr from-[#007aff]/10 to-[#00b8ff]/20 rounded-3xl" />
        <MessageSquare className="w-10 h-10 relative z-10" />
      </div>

      <h2 className="text-xl font-bold text-[#060708] mb-2">
        Веб-версия MAX
      </h2>
      <p className="text-sm text-[#060708]/60 max-w-sm mb-6 leading-relaxed">
        Выберите диалог в левой колонке или начните новый чат для отправки и получения сообщений в MAX через GREEN-API.
      </p>

      <div className="flex flex-col sm:flex-row items-center gap-3 mb-8">
        <Button variant="primary" size="md" onClick={onOpenNewChat}>
          Начать новый диалог
        </Button>
      </div>

      <div className="flex items-center gap-6 text-xs text-[#060708]/50 pt-6 border-t border-black/[0.06]">
        <div className="flex items-center gap-1.5">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>GREEN-API протокол</span>
        </div>
        <div className="flex items-center gap-1.5">
          <Zap className="w-4 h-4 text-amber-500" />
          <span>Мгновенная доставка</span>
        </div>
      </div>
    </div>
  );
};
