import { createAction } from '../createAction';

export const SHOW = 'notation-menu/SHOW';
export const HIDE = 'notation-menu/HIDE';
export const TOGGLE_VISIBILITY = 'notation-menu/TOGGLE_VISIBILITY';
export const SET_FRETBOARD_VISIBILITY = 'notation-menu/SET_FRETBOARD_VISIBILITY';

export const NotationMenuActions = {
  show: () => createAction(SHOW),
  hide: () => createAction(HIDE),
  toggleVisibility: () => createAction(TOGGLE_VISIBILITY),
  setFretboardVisibility: (fretboardVisible: boolean) => createAction(SET_FRETBOARD_VISIBILITY, { fretboardVisible })
};

export type NotationMenuActions = ActionsUnion<typeof NotationMenuActions>;
