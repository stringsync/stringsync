import { CLEAR_AUTH } from './constants';
import { ClearAuthAction } from './types';

export const clearAuth = (): ClearAuthAction => ({
  type: CLEAR_AUTH,
});
