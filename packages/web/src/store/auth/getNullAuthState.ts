import { AuthState } from './types';
import { getNullAuthUser } from './getNullAuthUser';

export const getNullAuthState = (): AuthState => ({
  isPending: true,
  user: getNullAuthUser(),
  errors: [],
});
