import { ConfirmEmailSuccessAction } from './types';
import { CONFIRM_EMAIL_SUCCESS } from './constants';

export const confirmEmailSuccess = (id: string): ConfirmEmailSuccessAction => ({
  type: CONFIRM_EMAIL_SUCCESS,
  id,
});
