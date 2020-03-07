import { AUTH_PENDING } from './constants';
import { AuthPendingAction } from './types';

export const authPending = (): AuthPendingAction => ({
  type: AUTH_PENDING,
});
