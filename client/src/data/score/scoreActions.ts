import { createAction } from '../createAction';
import { Maestro } from '../../models/maestro/Maestro';

export const SET_MAESTRO = 'score/SET_MAESTRO';
export const SET_SCROLLING = 'score/SET_SCROLLING';
export const SET_AUTO_SCROLL = 'score/SET_AUTO_SCROLL';

export const ScoreActions = {
  setMaestro: (maestro: Maestro | null) => createAction(SET_MAESTRO, { maestro }),
  setScrolling: (scrolling: boolean) => createAction(SET_SCROLLING, { scrolling }),
  setAutoScroll: (autoScroll: boolean) => createAction(SET_AUTO_SCROLL, { autoScroll })
};

export type ScoreActions = ActionsUnion<typeof ScoreActions>;
