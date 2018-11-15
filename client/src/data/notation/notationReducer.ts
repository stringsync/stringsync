import * as actions from './notationActions';
import { getDefaultState } from './getDefaultState';
import { INotation } from '../../@types/notation';

export const notationReducer = (state = getDefaultState(), action: actions.NotationActions): INotation => {
  let nextState = Object.assign({}, state);

  switch (action.type) {

    case actions.RESET_NOTATION:
      nextState = getDefaultState();
      return nextState;

    case actions.SET_NOTATION:
      nextState = Object.assign({}, action.payload.notation);
      return nextState;

    default:
      return nextState;
  }
};
