'use client';

import React, { useState } from 'react';
import { Phone, UserPlus } from 'lucide-react';
import { Modal, Input, Button } from '@/shared/ui';

interface NewChatModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreate: (phone: string, name?: string) => void;
  error?: string | null;
}

export const NewChatModal: React.FC<NewChatModalProps> = ({
  isOpen,
  onClose,
  onCreate,
  error: externalError,
}) => {
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [internalError, setInternalError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim()) {
      setInternalError('Введите номер телефона получателя');
      return;
    }
    setInternalError(null);
    onCreate(phone.trim(), name.trim() || undefined);
    setPhone('');
    setName('');
  };

  const displayError = internalError || externalError;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Новый диалог в MAX"
      description="Укажите номер телефона собеседника или идентификатор пользователя MAX"
      maxWidth="md"
    >
      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <Input
          label="Номер телефона или Chat ID"
          placeholder="+7 (999) 123-45-67 или 79991234567@c.us"
          value={phone}
          onChange={(e) => {
            setPhone(e.target.value);
            setInternalError(null);
          }}
          leftIcon={<Phone className="w-4 h-4" />}
          helperText="Формат: +7..., 8..., 79991234567@c.us или ID в MAX"
          required
          autoFocus
        />

        <Input
          label="Имя контакта (необязательно)"
          placeholder="Например: Иван Иванов"
          value={name}
          onChange={(e) => setName(e.target.value)}
          leftIcon={<UserPlus className="w-4 h-4" />}
        />

        {displayError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            {displayError}
          </div>
        )}

        <div className="flex items-center justify-end gap-2 pt-2 border-t border-black/[0.06]">
          <Button type="button" variant="ghost" size="md" onClick={onClose}>
            Отмена
          </Button>
          <Button type="submit" variant="primary" size="md">
            Создать чат
          </Button>
        </div>
      </form>
    </Modal>
  );
};
