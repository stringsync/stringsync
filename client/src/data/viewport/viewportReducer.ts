import * as actions from './viewportActions';
import getViewportType, { ViewportTypes } from './getViewportType';

export type IViewportState = StringSync.Store.IViewportState;

const getDefaultState = (): IViewportState => ({
  type: getViewportType(window.innerWidth),
  width: window.innerWidth
});

export const viewportReducer = (state = getDefaultState(), action: actions.ViewportActions): IViewportState => {
  const nextState = {...state};

  switch(action.type) {

    case actions.SET_VIEWPORT_WIDTH:
      nextState.type = getViewportType(action.payload.width);
      nextState.width = action.payload.width;
      return nextState;

    default:
      return nextState;
  }
};
