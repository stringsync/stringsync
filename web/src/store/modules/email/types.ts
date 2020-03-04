import {
  CONFIRM_EMAIL_FAILURE,
  CONFIRM_EMAIL_PENDING,
  CONFIRM_EMAIL_SUCCESS,
} from './constants';

export interface EmailState {
  isConfirmed: boolean;
  isPending: boolean;
  errors: string[];
}

export interface ConfirmEmailPendingAction {
  type: typeof CONFIRM_EMAIL_PENDING;
}

export interface ConfirmEmailSuccessAction {
  type: typeof CONFIRM_EMAIL_SUCCESS;
  id: string;
}

export interface ConfirmEmailFailureAction {
  type: typeof CONFIRM_EMAIL_FAILURE;
  errors: string[];
}

export type EmailActionTypes =
  | ConfirmEmailPendingAction
  | ConfirmEmailSuccessAction
  | ConfirmEmailFailureAction;
