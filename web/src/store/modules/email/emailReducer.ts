import {
  CONFIRM_EMAIL_FAILURE,
  CONFIRM_EMAIL_SUCCESS,
  CONFIRM_EMAIL_PENDING,
} from './constants';
import { EmailState, EmailActionTypes } from './types';
import { getInitialEmailState } from './getInitialEmailState';

export const emailReducer = (
  state = getInitialEmailState(),
  action: EmailActionTypes
): EmailState => {
  switch (action.type) {
    case CONFIRM_EMAIL_PENDING:
      return { ...state, isPending: true, errors: [] };
    case CONFIRM_EMAIL_SUCCESS:
      return { ...state, isPending: false, isConfirmed: true };
    case CONFIRM_EMAIL_FAILURE:
      return {
        ...state,
        isPending: false,
        isConfirmed: false,
        errors: action.errors,
      };
    default:
      return state;
  }
};
