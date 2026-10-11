'use client';

import React from 'react';
import { SquarePen, KeyRound, LogOut, Radio } from 'lucide-react';
import { InstanceState } from '@/entities/session';
import { GreenApiCredentials } from '@/shared/api';

interface SidebarHeaderProps {
  credentials: GreenApiCredentials | null;
  instanceState: InstanceState;
  isPolling: boolean;
  isLoading?: boolean;
  onOpenAuth: () => void;
  onOpenNewChat: () => void;
  onLogout: () => void;
}

export const SidebarHeader: React.FC<SidebarHeaderProps> = ({
  credentials,
  instanceState,
  isPolling,
  isLoading = false,
  onOpenAuth,
  onOpenNewChat,
  onLogout,
}) => {
  const getStatusBadge = () => {
    if (!credentials) {
      return (
        <button
          onClick={onOpenAuth}
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors border border-amber-200/60"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Настроить API</span>
        </button>
      );
    }

    if (isLoading || instanceState === 'unknown' || instanceState === 'starting') {
      return (
        <div
          title="Проверка подключения к инстансу..."
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-slate-100 text-slate-600 text-[11px] font-medium border border-slate-200/60"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-slate-400 animate-pulse" />
          <span>Подключение...</span>
        </div>
      );
    }

    if (instanceState === 'authorized') {
      return (
        <div
          title={isPolling ? 'Слушатель сообщений активен' : 'Инстанс авторизован'}
          className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[11px] font-medium border border-emerald-200/60"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span>Онлайн</span>
          {isPolling && <Radio className="w-3 h-3 text-emerald-600 animate-spin" />}
        </div>
      );
    }

    if (instanceState === 'notAuthorized') {
      return (
        <button
          onClick={onOpenAuth}
          title="Инстанс не авторизован в WhatsApp"
          className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-medium hover:bg-amber-100 transition-colors border border-amber-200/60"
        >
          <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
          <span>Не авторизован</span>
        </button>
      );
    }

    return (
      <button
        onClick={onOpenAuth}
        title="Ошибка подключения. Нажмите для повторной проверки или смены ключей"
        className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-red-50 text-red-600 text-xs font-medium hover:bg-red-100 transition-colors border border-red-200/60"
      >
        <span className="w-2 h-2 rounded-full bg-red-500" />
        <span>Ошибка связи</span>
      </button>
    );
  };

  return (
    <div className="flex items-center justify-between px-4 py-3 border-b border-black/6 bg-white">
      <div className="flex items-center gap-2.5">
        <div className="w-9 h-9 rounded-xl bg-linear-to-tr from-[#007aff] to-[#00b8ff] text-white font-bold flex items-center justify-center text-sm shadow-sm select-none">
          MAX
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sm text-[#060708] leading-tight">
            Мессенджер
          </span>
          <div className="mt-0.5">{getStatusBadge()}</div>
        </div>
      </div>

      <div className="flex items-center gap-1">
        <button
          onClick={onOpenNewChat}
          className="p-2 text-[#060708]/60 hover:text-[#007aff] hover:bg-black/5 active:bg-black/10 rounded-xl transition-colors cursor-pointer"
          title="Новый диалог"
          aria-label="Новый диалог"
        >
          <SquarePen className="w-5 h-5" />
        </button>

        <button
          onClick={onOpenAuth}
          className="p-2 text-[#060708]/60 hover:text-[#007aff] hover:bg-black/5 active:bg-black/10 rounded-xl transition-colors cursor-pointer"
          title="Настройки инстанса GREEN-API"
          aria-label="Настройки инстанса"
        >
          <KeyRound className="w-5 h-5" />
        </button>

        {credentials && (
          <button
            onClick={onLogout}
            className="p-2 text-[#060708]/40 hover:text-red-500 hover:bg-red-50 active:bg-red-100 rounded-xl transition-colors cursor-pointer"
            title="Выйти из инстанса"
            aria-label="Выйти"
          >
            <LogOut className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
