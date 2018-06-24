import { createAction } from 'utilities/redux';

export const SET_VIEWPORT_WIDTH = 'SET_VIEWPORT_WIDTH';

export const ViewportActions = {
  setViewportWidth: (width: number) => createAction(SET_VIEWPORT_WIDTH, { width })
}

export type ViewportActions = ActionsUnion<typeof ViewportActions>;
