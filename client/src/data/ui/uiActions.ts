import { createAction } from 'utilities/redux';

export const SET_NOTATION_MENU_VISIBILITY = 'SET_NOTATION_MENU_VISIBILITY';

export const UiActions = {
  setNotationMenuVisibility: (notationMenuVisibility: boolean) => createAction(SET_NOTATION_MENU_VISIBILITY, { notationMenuVisibility })
};

export type UiActions = ActionsUnion<typeof UiActions>;
