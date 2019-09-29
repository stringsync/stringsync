import { AuthState, AuthActionTypes, SET_AUTH, CLEAR_AUTH } from './types';
import getInitialState from './getInitialState';

export default (
  state = getInitialState(),
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case SET_AUTH:
      const { user, jwt } = action.payload;
      const isLoggedIn = Boolean(user && jwt);
      return {
        isLoggedIn,
        user,
        jwt,
      };
    case CLEAR_AUTH:
      return {
        isLoggedIn: false,
        user: null,
        jwt: null,
      };
    default:
      return { ...state };
  }
};
