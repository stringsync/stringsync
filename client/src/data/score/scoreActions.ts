import { createAction } from '../createAction';
import { Maestro, ISpec } from '../../models/maestro/Maestro';

export const SET_MAESTRO = 'score/SET_MAESTRO';
export const SET_SPEC = 'score/SET_SPEC';

export const ScoreActions = {
  setMaestro: (maestro: Maestro | null) => createAction(SET_MAESTRO, { maestro }),
  setSpec: (spec: ISpec | null) => createAction(SET_SPEC, { spec })
};

export type ScoreActions = ActionsUnion<typeof ScoreActions>;
