import { AuthState } from '.';
import { getNullAuthState } from './getNullAuthState';

export const getInitialAuthState = (): AuthState => ({
  ...getNullAuthState(),
  isPending: true, // assume there is a mechanism to reauth on init
  isLoggedIn: false,
  errors: [],
});
