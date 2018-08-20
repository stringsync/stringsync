import * as actions from './uiActions';

const getDefaultState = (): Store.IUiState => ({
  isLoopVisible: false,
  isNotationMenuVisible: false
});

export const uiReducer = (state = getDefaultState(), action: actions.UiActions): Store.IUiState => {
  const nextState = Object.assign({}, state);

  switch(action.type) {

    case actions.SET_NOTATION_MENU_VISIBILITY:
      nextState.isNotationMenuVisible = action.payload.notationMenuVisibility;
      return nextState;

    case actions.SET_LOOP_VISIBILITY:
      nextState.isLoopVisible = action.payload.loopVisibility;
      return nextState;

    default:
      return nextState;
  }
}
