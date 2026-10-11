import { GreenApiCredentials } from '@/shared/api';

export type InstanceState = 'authorized' | 'notAuthorized' | 'blocked' | 'sleepMode' | 'starting' | 'unknown';

export interface SessionState {
  credentials: GreenApiCredentials | null;
  stateInstance: InstanceState;
  isChecking: boolean;
  error: string | null;
}
