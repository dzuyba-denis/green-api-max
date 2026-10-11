'use client';

import { useState, useEffect, useCallback } from 'react';
import { GreenApiCredentials, GreenApiClient } from '@/shared/api';
import { safeLocalStorage } from '@/shared/lib/storage';
import { STORAGE_KEYS } from '@/shared/config/constants';
import { InstanceState } from '@/entities/session';

export function useAuthInstance() {
  const [instanceState, setInstanceState] = useState<InstanceState>('unknown');
  const [saved, setSaved] = useState<GreenApiCredentials | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isInitialized, setIsInitialized] = useState(false);
  const [credentials, setCredentials] = useState<GreenApiCredentials | null>(null);

  const checkStatus = async (creds: GreenApiCredentials) => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await GreenApiClient.getStateInstance(creds);
      setInstanceState((res.stateInstance as InstanceState) || 'authorized');
      return true;
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Ошибка подключения к инстансу';
      setError(message);
      setInstanceState('notAuthorized');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (idInstance: string, apiTokenInstance: string, apiUrl: string) => {
    if (!idInstance || !apiTokenInstance) {
      setError('Пожалуйста, заполните idInstance и apiTokenInstance');
      return false;
    }

    const creds: GreenApiCredentials = {
      idInstance,
      apiTokenInstance,
      apiUrl
    };

    const success = await checkStatus(creds);
    if (success) {
      setCredentials(creds);
      safeLocalStorage.setItem(STORAGE_KEYS.CREDENTIALS, creds);
      setError(null);
      return true;
    }
    return false;
  }

  const logout = useCallback(() => {
    setCredentials(null);
    setInstanceState('unknown');
    setError(null);
    safeLocalStorage.removeItem(STORAGE_KEYS.CREDENTIALS);
  }, []);

  /* eslint-disable react-hooks/set-state-in-effect -- Restore credentials stored in the browser after hydration. */
  useEffect(() => {
    const storedCredentials = safeLocalStorage.getItem<GreenApiCredentials | null>(
      STORAGE_KEYS.CREDENTIALS,
      null
    );
    const hasStoredCredentials = Boolean(
      storedCredentials?.idInstance && storedCredentials.apiTokenInstance
    );

    if (hasStoredCredentials) {
      setSaved(storedCredentials);
      setCredentials(storedCredentials);
      setIsLoading(true);
    } else {
      setIsInitialized(true);
    }
  }, []);
  /* eslint-enable react-hooks/set-state-in-effect */

  useEffect(() => {
    if (!saved?.idInstance || !saved.apiTokenInstance) {
      return;
    }

    let isActive = true;
    const initialize = async () => {
      try {
        const res = await GreenApiClient.getStateInstance(saved);
        if (isActive) {
          setInstanceState((res.stateInstance as InstanceState) || 'authorized');
        }
      } catch (err: unknown) {
        if (isActive) {
          const message =
            err instanceof Error ? err.message : 'Ошибка подключения к инстансу';
          setError(message);
          setInstanceState('notAuthorized');
        }
      } finally {
        if (isActive) {
          setIsLoading(false);
          setIsInitialized(true);
        }
      }
    };

    void initialize();
    return () => {
      isActive = false;
    };
  }, [saved]);

  return {
    credentials,
    instanceState,
    isLoading,
    error,
    isInitialized,
    login,
    logout,
    checkStatus,
  };
}
