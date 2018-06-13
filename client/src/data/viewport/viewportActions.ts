import { createAction } from 'redux-actions';

export const SET_VIEWPORT_WIDTH = 'SET_VIEWPORT_WIDTH';

export const setViewportWidth = createAction(
  SET_VIEWPORT_WIDTH,
  (width: number) => ({ width })
);
