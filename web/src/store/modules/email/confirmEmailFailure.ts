import { ConfirmEmailFailureAction } from './types';
import { CONFIRM_EMAIL_FAILURE } from './constants';

export const confirmEmailFailure = (
  errors: string[]
): ConfirmEmailFailureAction => ({
  type: CONFIRM_EMAIL_FAILURE,
  errors,
});
