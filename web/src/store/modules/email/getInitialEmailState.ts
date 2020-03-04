import { EmailState } from './types';

export const getInitialEmailState = (): EmailState => ({
  isPending: false,
  isConfirmed: false,
  errors: [],
});
