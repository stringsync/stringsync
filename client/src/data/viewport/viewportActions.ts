import { createAction } from 'utilities/redux';

export const SET_VIEWPORT_WIDTH = 'SET_VIEWPORT_WIDTH';

export const Actions = {
  setViewportWidth: (width: number) => createAction(SET_VIEWPORT_WIDTH, { width })
}

export type Actions = ActionsUnion<typeof Actions>;
