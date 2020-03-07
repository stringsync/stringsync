import { HistoryState, HistoryActions } from './types';
import { getInitialHistoryState } from './getInitialHistoryState';
import { SET_RETURN_TO_PAGE } from './constants';

export const historyReducer = (
  state = getInitialHistoryState(),
  action: HistoryActions
): HistoryState => {
  switch (action.type) {
    case SET_RETURN_TO_PAGE:
      return { ...state, returnToPage: action.payload.returnToPage };
    default:
      return state;
  }
};
