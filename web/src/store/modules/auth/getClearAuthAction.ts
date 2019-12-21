import { CLEAR_AUTH } from './constants';
import { ClearAuthAction } from './types';

export const getClearAuthAction = (): ClearAuthAction => ({
  type: CLEAR_AUTH,
});
