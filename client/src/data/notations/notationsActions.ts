import { createAction } from 'utilities/redux';

export const SET_NOTATIONS_INDEX = 'SET_NOTATIONS_INDEX';
export const SET_NOTATIONS_SHOW = 'SET_NOTATIONS_SHOW';
export const RESET_NOTATIONS_SHOW = 'RESET_NOTATIONS_SHOW';
export const SET_NOTATIONS_EDIT = 'SET_NOTATIONS_EDIT';
export const RESET_NOTATIONS_EDIT = 'RESET_NOTATIONS_EDIT';
export const UPDATE_NOTATIONS_EDIT = 'UPDATE_NOTATIONS_EDIT';

export const NotationsActions = {
  resetNotationEdit: () => createAction(RESET_NOTATIONS_EDIT),
  resetNotationShow: () => createAction(RESET_NOTATIONS_SHOW),
  setNotationEdit: (notation: Notation.INotation) => createAction(SET_NOTATIONS_EDIT, { notation }),
  setNotationShow: (notation: Notation.INotation) => createAction(SET_NOTATIONS_SHOW, { notation }),
  setNotationsIndex: (notations: Notation.INotation[]) => createAction(SET_NOTATIONS_INDEX, { notations }),
  updateNotationEdit: (notation: Notation.INotation) => createAction(UPDATE_NOTATIONS_EDIT, { notation })
};

export type NotationsActions = ActionsUnion<typeof NotationsActions>
