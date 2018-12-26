import { createAction } from '../createAction';
import { Maestro } from '../../models/maestro/Maestro';

export const SET_MAESTRO = 'score/SET_MAESTRO';
export const SET_SCROLLING = 'score/SET_SCROLLING';

export const ScoreActions = {
  setMaestro: (maestro: Maestro | null) => createAction(SET_MAESTRO, { maestro }),
  setScrolling: (scrolling: boolean) => createAction(SET_SCROLLING, { scrolling })
};

export type ScoreActions = ActionsUnion<typeof ScoreActions>;
