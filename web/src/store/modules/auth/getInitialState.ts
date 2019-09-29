import { AuthUser, AuthState, AUTH_JWT_KEY, AUTH_USER_KEY } from './types';

const getInitialState = (): AuthState => {
  let jwt = window.localStorage.getItem(AUTH_JWT_KEY);
  const maybeUserJson = window.localStorage.getItem(AUTH_USER_KEY);
  let user: AuthUser | null = null;
  let isLoggedIn = false;

  if (!jwt || !maybeUserJson) {
    jwt = null;
    user = null;
  } else {
    user = JSON.parse(maybeUserJson);
    // we don't actually know if the user is logged in until we
    // verify the auth, but we assume they are for now to prevent
    // a UI state flicker where it appears a user is not logged in
    isLoggedIn = true;
  }

  return {
    isLoggedIn,
    user,
    jwt,
  };
};

export default getInitialState;
