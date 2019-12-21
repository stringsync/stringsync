import { REQUEST_AUTH_SUCCESS } from './constants';
import { AuthUser, RequestAuthSuccessAction } from './types';

export const getRequestAuthSuccessAction = (
  user: AuthUser
): RequestAuthSuccessAction => ({
  type: REQUEST_AUTH_SUCCESS,
  payload: { user },
});
