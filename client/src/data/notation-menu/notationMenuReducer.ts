import * as actions from './notationMenuActions';
import { getDefaultState } from './getDefaultState';
import { INotationMenuState } from '../../@types/store';

export const notationMenuReducer =
  (state = getDefaultState(), action: actions.NotationMenuActions): INotationMenuState => {
    let nextState = Object.assign({}, state);

    switch (action.type) {
      case actions.SHOW:
        nextState = Object.assign({}, { visible: true });
        return nextState;

      case actions.HIDE:
        nextState = Object.assign({}, { visible: false });
        return nextState;

      case actions.TOGGLE_VISIBILITY:
        nextState = Object.assign({}, { visible: !state.visible });
        return nextState;

      default:
        return nextState;
    }
  };
