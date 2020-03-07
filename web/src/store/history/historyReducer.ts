import { HistoryState, HistoryActions } from './types';
import { getInitialHistoryState } from './getInitialHistoryState';
import { SET_RETURN_TO_ROUTE } from './constants';

export const historyReducer = (
  state = getInitialHistoryState(),
  action: HistoryActions
): HistoryState => {
  switch (action.type) {
    case SET_RETURN_TO_ROUTE:
      return { ...state, returnToRoute: action.payload.returnToRoute };
    default:
      return state;
  }
};
