import { createAction } from 'utilities/redux';

export const SET_NOTATIONS_INDEX = 'SET_NOTATIONS_INDEX';
export const SET_NOTATION_SHOW = 'SET_NOTATION_SHOW';
export const RESET_NOTATION_SHOW = 'RESET_NOTATION_SHOW';
export const SET_NOTATION_EDIT = 'SET_NOTATION_EDIT';
export const RESET_NOTATION_EDIT = 'RESET_NOTATION_EDIT';
export const UPDATE_NOTATION_EDIT = 'UPDATE_NOTATION_EDIT';

export const NotationsActions = {
  resetNotationEdit: () => createAction(RESET_NOTATION_EDIT),
  resetNotationShow: () => createAction(RESET_NOTATION_SHOW),
  setNotationEdit: (notation: Notation.INotation) => createAction(SET_NOTATION_EDIT, { notation }),
  setNotationShow: (notation: Notation.INotation) => createAction(SET_NOTATION_SHOW, { notation }),
  setNotationsIndex: (notations: Notation.INotation[]) => createAction(SET_NOTATIONS_INDEX, { notations }),
  updateNotationEdit: (notation: Notation.INotation) => createAction(UPDATE_NOTATION_EDIT, { notation })
};

export type NotationsActions = ActionsUnion<typeof NotationsActions>
