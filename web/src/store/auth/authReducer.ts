import {
  AUTH_PENDING,
  AUTH_SUCCESS,
  AUTH_FAILURE,
  CLEAR_AUTH_ERRORS,
  CLEAR_AUTH,
  CONFIRM_EMAIL,
} from './constants';
import { AuthState, AuthActionTypes } from './types';
import { getInitialAuthState } from './getInitialAuthState';
import { getNullAuthState } from './getNullAuthState';

export const authReducer = (
  state = getInitialAuthState(),
  action: AuthActionTypes
): AuthState => {
  switch (action.type) {
    case AUTH_PENDING:
      return { ...state, isPending: true, errors: [] };
    case AUTH_SUCCESS:
      const user = { ...action.payload.user };
      return { isPending: false, isLoggedIn: true, user, errors: [] };
    case AUTH_FAILURE:
      const errors = [...action.payload.errors];
      return {
        ...getNullAuthState(),
        isLoggedIn: false,
        isPending: false,
        errors,
      };
    case CONFIRM_EMAIL:
      return {
        ...state,
        user: { ...state.user, confirmedAt: action.payload.confirmedAt },
      };
    case CLEAR_AUTH:
      return getNullAuthState();
    case CLEAR_AUTH_ERRORS:
      return { ...state, errors: [] };
    default:
      return state;
  }
};
