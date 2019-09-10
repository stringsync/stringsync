import { ScreenState, ScreenActionTypes, SET_DIMENSIONS } from './types';
import getInitialState from './getInitialState';
import { getScreenState } from './getScreenState';

export default (
  state = getInitialState(),
  action: ScreenActionTypes
): ScreenState => {
  switch (action.type) {
    case SET_DIMENSIONS:
      const { width, height } = action.payload;
      return getScreenState(width, height);
    default:
      return { ...state };
  }
};
