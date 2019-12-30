import {
  REQUEST_AUTH_PENDING,
  REQUEST_AUTH_SUCCESS,
  REQUEST_AUTH_FAILURE,
  CLEAR_AUTH_ERRORS,
  CLEAR_AUTH,
} from './constants';
import { AuthState, AuthActionTypes } from './types';
import { getInitialAuthState } from './getInitialAuthState';
import getNullState from './getNullState';

export const authReducer = (
  state = getInitialAuthState(),
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case REQUEST_AUTH_PENDING:
      return { ...state, isPending: true, errors: [] };
    case REQUEST_AUTH_SUCCESS:
      const user = { ...action.payload.user };
      return { isPending: false, isLoggedIn: true, user, errors: [] };
    case REQUEST_AUTH_FAILURE:
      const errors = [...action.payload.errors];
      return { ...getNullState(), isLoggedIn: false, isPending: false, errors };
    case CLEAR_AUTH:
      return getNullState();
    case CLEAR_AUTH_ERRORS:
      return { ...state, errors: [] };
    default:
      return state;
  }
};
