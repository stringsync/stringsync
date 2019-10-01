import {
  AuthState,
  AuthActionTypes,
  REQUEST_AUTH_PENDING,
  REQUEST_AUTH_SUCCESS,
  REQUEST_AUTH_FAILURE,
  CLEAR_AUTH_ERRORS,
} from '.';
import getInitialState from './getInitialState';
import getNullState from './getNullState';

export default (
  state = getInitialState(),
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case REQUEST_AUTH_PENDING:
      return { ...state, isPending: true, errors: [] };
    case REQUEST_AUTH_SUCCESS:
      const user = { ...action.payload.user };
      const jwt = action.payload.jwt;
      return { isPending: false, isLoggedIn: true, user, jwt, errors: [] };
    case REQUEST_AUTH_FAILURE:
      const errors = [...action.payload.errors];
      return { ...getNullState(), isLoggedIn: false, isPending: false, errors };
    case CLEAR_AUTH_ERRORS:
      return { ...state, errors: [] };
    default:
      return state;
  }
};
