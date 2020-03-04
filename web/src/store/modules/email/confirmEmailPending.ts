import { ConfirmEmailPendingAction } from './types';
import { CONFIRM_EMAIL_PENDING } from './constants';

export const confirmEmailPending = (): ConfirmEmailPendingAction => ({
  type: CONFIRM_EMAIL_PENDING,
});
