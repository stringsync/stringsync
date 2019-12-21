import { CLEAR_AUTH_ERRORS } from './constants';
import { ClearAuthErrorsAction } from './types';

export const getClearAuthErrorsAction = (): ClearAuthErrorsAction => ({
  type: CLEAR_AUTH_ERRORS,
});
