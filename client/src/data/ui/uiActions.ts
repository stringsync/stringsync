import { createAction } from 'utilities/redux';

export const SET_NOTATION_MENU_VISIBILITY = 'SET_NOTATION_MENU_VISIBILITY';
export const SET_LOOP_VISIBILITY = 'SET_LOOP_VISIBILITY';

export const UiActions = {
  setLoopVisibility: (loopVisibility: boolean) => createAction(SET_LOOP_VISIBILITY, { loopVisibility }),
  setNotationMenuVisibility: (notationMenuVisibility: boolean) => createAction(SET_NOTATION_MENU_VISIBILITY, { notationMenuVisibility })
};

export type UiActions = ActionsUnion<typeof UiActions>;
