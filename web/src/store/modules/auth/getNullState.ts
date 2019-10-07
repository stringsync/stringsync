import { AuthState, AuthUser } from '.';

export const getNullAuthUser = (): AuthUser => ({
  id: -1,
  username: '',
  email: '',
});

const getNullState = (): AuthState => ({
  isPending: false,
  user: getNullAuthUser(),
  isLoggedIn: false,
  errors: [],
});

export default getNullState;
