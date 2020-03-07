import { ConfirmEmailAction } from './types';
import { CONFIRM_EMAIL } from './constants';

export const confirmEmail = (confirmedAt: Date): ConfirmEmailAction => ({
  type: CONFIRM_EMAIL,
  payload: { confirmedAt },
});
