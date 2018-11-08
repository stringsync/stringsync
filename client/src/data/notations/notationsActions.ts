import { createAction } from '../createAction';
import { INotation } from '../../@types/notation';

export const SET_NOTATIONS = 'SET_NOTATIONS';

export const NotationsActions = {
  setNotations: (notations: INotation[]) => createAction(SET_NOTATIONS, { notations }),
};

export type NotationsActions = ActionsUnion<typeof NotationsActions>;
