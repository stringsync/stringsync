import { createAction } from '../createAction';
import { INotation } from '../../@types/notation';

export const RESET_NOTATION = 'notation/RESET_NOTATION';
export const SET_NOTATION = 'notation/SET_NOTATION';

export const NotationActions = {
  resetNotation: () => createAction(RESET_NOTATION),
  setNotation: (notation: INotation) => createAction(SET_NOTATION, { notation })
};

export type NotationActions = ActionsUnion<typeof NotationActions>;
