import { AuthState, AUTH_USER_KEY, AuthUser } from '.';
import getNullState from './getNullState';
import { pick } from 'lodash';

const getInitialState = (): AuthState => {
  const maybeUserJson = window.localStorage.getItem(AUTH_USER_KEY);

  // the absence of the ss:auth:user key in localstorage implies
  // that the user is not logged in
  if (!maybeUserJson) {
    return getNullState();
  }

  try {
    const user: AuthUser = pick(JSON.parse(maybeUserJson), [
      'id',
      'username',
      'email',
    ]);
    // We don't know if the user is actually logged in
    // until we refresh the auth. However, we assume it's
    // true to prevent flicking UI state changes
    return {
      user,
      isPending: false,
      isLoggedIn: true,
      errors: [],
    };
  } catch (error) {
    console.error(error);
    return getNullState();
  }
};

export default getInitialState;
