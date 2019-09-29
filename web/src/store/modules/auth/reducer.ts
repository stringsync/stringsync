import { AuthState, AuthActionTypes, SET_AUTH, CLEAR_AUTH } from './types';
import getInitialState from './getInitialState';

export default (
  state = getInitialState(),
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case SET_AUTH:
      const { user, jwt } = action.payload;
      return {
        ...user,
        jwt,
        isLoggedIn: true,
      };

    case CLEAR_AUTH:
      return {
        id: -1,
        username: '',
        email: '',
        jwt: '',
        isLoggedIn: false,
      };
    default:
      return { ...state };
  }
};
