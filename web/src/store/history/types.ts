import { SET_RETURN_TO_ROUTE } from './constants';

export interface HistoryState {
  returnToRoute: string;
}

export interface SetReturnToRouteAction {
  type: typeof SET_RETURN_TO_ROUTE;
  payload: { returnToRoute: string };
}

export type HistoryActions = SetReturnToRouteAction;
