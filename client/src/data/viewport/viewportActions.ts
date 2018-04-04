import { createActions } from 'redux-actions';

export interface WidthPayload {
  readonly width: number;
}

const viewportActions = createActions({
  SET_VIEWPORT_WIDTH: (width: number): WidthPayload => Object.freeze({ width })
});

export default viewportActions;
