import { AuthState } from '.';
import { getNullAuthUser } from './getNullState';

export const getInitialAuthState = (): AuthState => ({
  isPending: true, // assume there is a mechanism to reauth on init
  user: getNullAuthUser(),
  isLoggedIn: false,
  errors: [],
});
