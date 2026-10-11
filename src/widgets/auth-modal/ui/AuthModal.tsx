'use client';

import React, { useState } from 'react';
import { KeyRound, Server, ShieldCheck, ExternalLink } from 'lucide-react';
import { Modal, Input, Button } from '@/shared/ui';
import { GreenApiCredentials } from '@/shared/api';
import {
  DEFAULT_API_URL,
  DEFAULT_ID_INSTANCE,
  DEFAULT_API_TOKEN_INSTANCE,
} from '@/shared/config/constants';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentCredentials: GreenApiCredentials | null;
  onSave: (idInstance: string, apiTokenInstance: string, apiUrl: string) => Promise<boolean>;
  isLoading: boolean;
  error: string | null;
}

const AuthForm: React.FC<{
  currentCredentials: GreenApiCredentials | null;
  onSave: (idInstance: string, apiTokenInstance: string, apiUrl: string) => Promise<boolean>;
  onClose: () => void;
  isLoading: boolean;
  error: string | null;
}> = ({ currentCredentials, onSave, onClose, isLoading, error }) => {
  const [idInstance, setIdInstance] = useState(
    currentCredentials?.idInstance || DEFAULT_ID_INSTANCE || ''
  );
  const [apiTokenInstance, setApiTokenInstance] = useState(
    currentCredentials?.apiTokenInstance || DEFAULT_API_TOKEN_INSTANCE || ''
  );
  const [apiUrl, setApiUrl] = useState(
    currentCredentials?.apiUrl || DEFAULT_API_URL
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await onSave(idInstance, apiTokenInstance, apiUrl);
    if (success) {
      onClose();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <Input
        label="ID инстанса (idInstance)"
        placeholder="Например: 1101823456"
        value={idInstance}
        onChange={(e) => setIdInstance(e.target.value)}
        leftIcon={<KeyRound className="w-4 h-4" />}
        required
        autoFocus
      />

      <Input
        label="Токен инстанса (apiTokenInstance)"
        placeholder="Например: d75b83870...02ffc4b"
        type="password"
        value={apiTokenInstance}
        onChange={(e) => setApiTokenInstance(e.target.value)}
        leftIcon={<ShieldCheck className="w-4 h-4" />}
        required
      />

      <Input
        label="API URL (хост инстанса)"
        placeholder={DEFAULT_API_URL}
        value={apiUrl}
        onChange={(e) => setApiUrl(e.target.value)}
        helperText="По умолчанию https://api.green-api.com или адрес вашего регионального кластера"
        leftIcon={<Server className="w-4 h-4" />}
      />

      {error && (
        <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600 leading-relaxed">
          {error}
        </div>
      )}

      <div className="bg-[#f5f7fa] p-3.5 rounded-xl text-xs text-[#060708]/70 flex flex-col gap-1.5 border border-black/4">
        <div className="font-semibold text-[#060708]">Где найти эти данные?</div>
        <p>
          В личном кабинете GREEN-API в разделе вашего инстанса MAX:{' '}
          <a
            href="https://console.green-api.com"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#007aff] hover:underline inline-flex items-center gap-1 font-medium"
          >
            console.green-api.com <ExternalLink className="w-3 h-3" />
          </a>
        </p>
      </div>

      <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/6">
        {currentCredentials && (
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Отмена
          </Button>
        )}
        <Button
          type="submit"
          variant="primary"
          size="md"
          isLoading={isLoading}
          className="w-full sm:w-auto"
        >
          Сохранить и подключиться
        </Button>
      </div>
    </form>
  );
};

export const AuthModal: React.FC<AuthModalProps> = ({
  isOpen,
  onClose,
  currentCredentials,
  onSave,
  isLoading,
  error,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Авторизация GREEN-API"
      description="Введите данные вашего инстанса GREEN-API для подключения к мессенджеру MAX"
      maxWidth="md"
    >
      <AuthForm
        key={currentCredentials?.idInstance || 'new'}
        currentCredentials={currentCredentials}
        onSave={onSave}
        onClose={onClose}
        isLoading={isLoading}
        error={error}
      />
    </Modal>
  );
};
