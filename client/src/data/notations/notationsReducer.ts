import * as actions from './notationsActions';
import { merge } from 'lodash';

// For type annotation
const getDefaultState = (): Notation.INotation[] => [];

export const notationsReducer = (state = getDefaultState(), action: actions.NotationsActions): Notation.INotation[] => {
  let nextState = state.map(notation => Object.assign({}, notation));

  switch(action.type) {
    
    case actions.SET_NOTATIONS:
      nextState = action.payload.notations.map(notation => Object.assign({}, notation));
      return nextState;

    default:
      return nextState;
  }
};
