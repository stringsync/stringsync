import { REQUEST_AUTH_FAILURE } from './constants';
import { RequestAuthFailureAction } from './types';

export const getRequestAuthFailureAction = (
  errors: string[]
): RequestAuthFailureAction => ({
  type: REQUEST_AUTH_FAILURE,
  payload: { errors },
});
