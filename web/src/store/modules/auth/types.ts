import { User } from 'common/types';
import {
  CLEAR_AUTH,
  CLEAR_AUTH_ERRORS,
  REQUEST_AUTH_FAILURE,
  REQUEST_AUTH_PENDING,
  REQUEST_AUTH_SUCCESS,
} from './constants';

export type AuthUser = Pick<User, 'id' | 'email' | 'username'>;

export interface AuthState {
  isPending: boolean;
  user: AuthUser;
  isLoggedIn: boolean;
  errors: string[];
}

export interface ClearAuthAction {
  type: typeof CLEAR_AUTH;
}

export interface ClearAuthErrorsAction {
  type: typeof CLEAR_AUTH_ERRORS;
}

export interface RequestAuthFailureAction {
  type: typeof REQUEST_AUTH_FAILURE;
  payload: { errors: string[] };
}

export interface RequestAuthPendingAction {
  type: typeof REQUEST_AUTH_PENDING;
}

export interface RequestAuthSuccessAction {
  type: typeof REQUEST_AUTH_SUCCESS;
  payload: { user: AuthUser };
}

export type AuthActionTypes =
  | RequestAuthPendingAction
  | RequestAuthSuccessAction
  | RequestAuthFailureAction
  | ClearAuthAction
  | ClearAuthErrorsAction;
