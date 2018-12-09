import { getDefaultState } from './getDefaultState';
import * as actions from './scoreActions';
import { IScoreState } from '../../@types/store';

export const scoreReducer = (state = getDefaultState(), action: actions.ScoreActions): IScoreState => {
  const nextState = { ...state };

  switch (action.type) {
    case actions.SET_MAESTRO:
      nextState.maestro = action.payload.maestro;
      return nextState;

    case actions.SET_SPEC:
      nextState.spec = action.payload.spec;
      return nextState;

    default:
      return nextState;
  }
};
