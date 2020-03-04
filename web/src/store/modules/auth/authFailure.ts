import { AUTH_FAILURE } from './constants';
import { AuthFailureAction } from './types';

export const authFailure = (errors: string[]): AuthFailureAction => ({
  type: AUTH_FAILURE,
  payload: { errors },
});
