import { ViewportState, ViewportActionTypes, SET_BREAKPOINT_NAME } from '.';
import { getInitialViewportState } from './getInitialViewportState';
import { getViewportState } from './getViewportState';

export const viewportReducer = (
  state = getInitialViewportState(),
  action: ViewportActionTypes
): ViewportState => {
  switch (action.type) {
    case SET_BREAKPOINT_NAME:
      return getViewportState(action.payload.breakpointName);
    default:
      return state;
  }
};
