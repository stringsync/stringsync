import { SET_RETURN_TO_PAGE } from './constants';

export interface HistoryState {
  returnToPage: string;
}

export interface SetReturnToPageAction {
  type: typeof SET_RETURN_TO_PAGE;
  payload: { returnToPage: string };
}

export type HistoryActions = SetReturnToPageAction;
