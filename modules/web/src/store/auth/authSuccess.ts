import { AUTH_SUCCESS } from './constants';
import { AuthUser, AuthSuccessAction } from './types';

export const authSuccess = (user: AuthUser): AuthSuccessAction => ({
  type: AUTH_SUCCESS,
  payload: { user },
});
