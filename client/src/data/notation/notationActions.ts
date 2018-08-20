import { createAction } from 'utilities/redux';

export const RESET_NOTATION = 'RESET_NOTATION';
export const SET_NOTATION = 'SET_NOTATION';

export const NotationActions = {
  resetNotation: () => createAction(RESET_NOTATION),
  setNotation: (notation: Notation.INotation) => createAction(SET_NOTATION, { notation })
};

export type NotationActions = ActionsUnion<typeof NotationActions>
