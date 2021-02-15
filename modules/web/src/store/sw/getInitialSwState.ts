import { SwState } from './types';

export const getInitialSwState = (): SwState => ({
  isInitialized: false,
  isUpdated: false,
  registration: null,
});
