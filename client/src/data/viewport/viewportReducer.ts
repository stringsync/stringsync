import * as actions from './viewportActions';
import getViewportType, { ViewportTypes } from './getViewportType';

export interface IViewportState {
  type: ViewportTypes;
  width: number;
}

export const getInitialState = (): IViewportState => ({
  type: 'DESKTOP',
  width: window.innerWidth
});

export const viewportReducer = (state = getInitialState(), action: actions.ViewportActions): IViewportState => {
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
