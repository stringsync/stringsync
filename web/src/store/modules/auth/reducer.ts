import { AuthState, AuthActionTypes, SET_AUTH, CLEAR_AUTH } from '.';
import getInitialState from './getInitialState';
import getNullState from './getNullState';

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
      return getNullState();
    default:
      return { ...state };
  }
};
