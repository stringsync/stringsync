import { User } from '../../../common/types';
import {
  CLEAR_AUTH,
  CLEAR_AUTH_ERRORS,
  AUTH_FAILURE,
  AUTH_PENDING,
  AUTH_SUCCESS,
} from './constants';

export type AuthUser = Pick<User, 'id' | 'email' | 'username' | 'role'>;

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

export interface AuthFailureAction {
  type: typeof AUTH_FAILURE;
  payload: { errors: string[] };
}

export interface AuthPendingAction {
  type: typeof AUTH_PENDING;
}

export interface AuthSuccessAction {
  type: typeof AUTH_SUCCESS;
  payload: { user: AuthUser };
}

export type AuthActionTypes =
  | AuthPendingAction
  | AuthSuccessAction
  | AuthFailureAction
  | ClearAuthAction
  | ClearAuthErrorsAction;
