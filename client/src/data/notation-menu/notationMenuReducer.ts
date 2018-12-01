import * as actions from './notationMenuActions';
import { getDefaultState } from './getDefaultState';
import { INotationMenuState } from '../../@types/store';

export const notationMenuReducer =
  (state = getDefaultState(), action: actions.NotationMenuActions): INotationMenuState => {
    const nextState = Object.assign({}, state);

    switch (action.type) {
      case actions.SHOW:
        nextState.visible = true;
        return nextState;

      case actions.HIDE:
        nextState.visible = false;
        return nextState;

      case actions.TOGGLE_VISIBILITY:
        nextState.visible = !state.visible;
        return nextState;

      case actions.SET_FRETBOARD_VISIBILITY:
        nextState.fretboardVisible = action.payload.fretboardVisible;
        return nextState;

      default:
        return nextState;
    }
  };
