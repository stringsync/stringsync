import { ScreenState, ScreenActionTypes, SET_BREAKPOINT_NAME } from './types';
import getInitialState from './getInitialState';
import { getScreenState } from './getScreenState';

export default (
  state = getInitialState(),
  action: ScreenActionTypes
): ScreenState => {
  switch (action.type) {
    case SET_BREAKPOINT_NAME:
      return getScreenState(action.payload.breakpointName);
    default:
      return { ...state };
  }
};
