import { createAction } from 'utilities/redux';

export const SET_TIME = 'maestro/SET_TIME';

export const MaestroActions = {
  setTime: (timeMs: number) => createAction(SET_TIME, { timeMs })
};

export type MaestroActions = ActionsUnion<typeof MaestroActions>;
