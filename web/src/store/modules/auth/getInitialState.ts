import { AuthState, AUTH_JWT_KEY, AUTH_USER_KEY, AuthUser } from '.';
import getNullState from './getNullState';
import { pick } from 'lodash';

const getInitialState = (): AuthState => {
  const jwt = window.localStorage.getItem(AUTH_JWT_KEY);
  const maybeUserJson = window.localStorage.getItem(AUTH_USER_KEY);

  if (!jwt || !maybeUserJson) {
    return getNullState();
  }

  const user: AuthUser = pick(JSON.parse(maybeUserJson), [
    'id',
    'username',
    'email',
  ]);
  // We don't know if the user is actually logged in
  // until we refresh the auth. However, we assume it's
  // true to prevent flicking UI state changes
  return {
    ...user,
    jwt,
    isLoggedIn: true,
  };
};

export default getInitialState;
