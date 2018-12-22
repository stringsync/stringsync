import { createAction } from '../createAction';
import { ISession } from '../../@types/user';

export const SET_SESSION = 'SET_SESSION';
export const RESET_SESSION = 'RESET_SESSION';

export const SessionActions = {
  resetSession: () => createAction(RESET_SESSION),
  setSession: (user: ISession) => createAction(SET_SESSION, { user })
};

export type SessionActions = ActionsUnion<typeof SessionActions>;
