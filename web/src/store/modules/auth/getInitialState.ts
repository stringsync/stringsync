import { AuthState } from '.';
import { getNullAuthUser } from './getNullState';

const getInitialState = (): AuthState => ({
  isPending: true, // assume there is a mechanism to reauth on init
  user: getNullAuthUser(),
  isLoggedIn: false,
  errors: [],
});

export default getInitialState;
