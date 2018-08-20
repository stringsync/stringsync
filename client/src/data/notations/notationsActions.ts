import { createAction } from "utilities/redux";

export const SET_NOTATIONS = 'SET_NOTATIONS';

export const NotationsActions = {
  setNotations: (notations: Notation.INotation[]) => createAction(SET_NOTATIONS, { notations }),
};

export type NotationsActions = ActionsUnion<typeof NotationsActions>
