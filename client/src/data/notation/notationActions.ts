import { createAction } from 'utilities/redux';

export const RESET_NOTATION = 'notation/RESET_NOTATION';
export const SET_NOTATION = 'notation/SET_NOTATION';
export const SET_VEXTAB_STRING = 'notation/SET_VEXTAB_STRING';

export const NotationActions = {
  resetNotation: () => createAction(RESET_NOTATION),
  setNotation: (notation: Notation.INotation) => createAction(SET_NOTATION, { notation }),
  setVextabString: (vextabString: string) => createAction(SET_VEXTAB_STRING, { vextabString })
};

export type NotationActions = ActionsUnion<typeof NotationActions>
