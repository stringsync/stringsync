import { Fretboard } from './../../models/fretboard';
import { createAction } from '../createAction';
import { Maestro, ISpec } from '../../models/maestro/Maestro';

export const SET_MAESTRO = 'score/SET_MAESTRO';
export const SET_FRETBOARD = 'score/SET_FRETBOARD';

export const ScoreActions = {
  setMaestro: (maestro: Maestro | null) => createAction(SET_MAESTRO, { maestro }),
  setFretboard: (fretboard: Fretboard | null) => createAction(SET_FRETBOARD, { fretboard })
};

export type ScoreActions = ActionsUnion<typeof ScoreActions>;
