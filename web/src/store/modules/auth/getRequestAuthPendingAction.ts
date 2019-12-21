import { REQUEST_AUTH_PENDING } from './constants';
import { RequestAuthPendingAction } from './types';

export const getRequestAuthPendingAction = (): RequestAuthPendingAction => ({
  type: REQUEST_AUTH_PENDING,
});
