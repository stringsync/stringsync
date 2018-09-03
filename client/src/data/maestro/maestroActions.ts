import { createAction } from 'utilities/redux';

export const SET_TIME_MS = 'maestro/SET_TIME_MS';

export const MaestroActions = {
  setTimeMs: (timeMs: number) => createAction(SET_TIME_MS, { timeMs })
};

export type MaestroActions = ActionsUnion<typeof MaestroActions>;
