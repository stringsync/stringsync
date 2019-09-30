import { ViewportState, ViewportActionTypes, SET_BREAKPOINT_NAME } from '.';
import getInitialState from './getInitialState';
import getViewportState from './getViewportState';

export default (
  state = getInitialState(),
  action: ViewportActionTypes
): ViewportState => {
  switch (action.type) {
    case SET_BREAKPOINT_NAME:
      return getViewportState(action.payload.breakpointName);
    default:
      return { ...state };
  }
};
