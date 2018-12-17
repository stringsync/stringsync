import { getDefaultState } from './getDefaultState';
import * as actions from './scoreActions';
import { IScoreState } from '../../@types/store';

export const scoreReducer = (state = getDefaultState(), action: actions.ScoreActions): IScoreState => {
  const nextState = { ...state };

  switch (action.type) {
    case actions.SET_MAESTRO:
      nextState.maestro = action.payload.maestro;
      return nextState;

    case actions.SET_FRETBOARD:
      nextState.fretboard = action.payload.fretboard;
      return nextState;

    default:
      return nextState;
  }
};
