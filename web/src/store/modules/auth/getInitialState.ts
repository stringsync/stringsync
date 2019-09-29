import { AuthUser, AuthState, AUTH_JWT_KEY, AUTH_USER_KEY } from './types';

const getInitialState = (): AuthState => {
  let jwt = window.localStorage.getItem(AUTH_JWT_KEY);
  const maybeUserJson = window.localStorage.getItem(AUTH_USER_KEY);
  let user: AuthUser = {
    id: -1,
    username: '',
    email: '',
  };
  let isLoggedIn = false;

  if (!jwt || !maybeUserJson) {
    jwt = '';
  } else {
    user = JSON.parse(maybeUserJson);
    // We don't know if the user is actually logged in
    // until we refresh the auth. However, we assume it's
    // true to prevent flicking UI state changes
    isLoggedIn = true;
  }

  return {
    ...user,
    jwt,
    isLoggedIn,
  };
};

export default getInitialState;
