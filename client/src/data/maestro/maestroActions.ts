import { createAction } from 'utilities/redux';

export const UPDATE = 'maestro/UPDATE';

export const MaestroActions = {
  update: (state: Store.IMaestroState) => createAction(UPDATE, { state })
};

export type MaestroActions = ActionsUnion<typeof MaestroActions>;
