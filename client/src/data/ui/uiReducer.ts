import * as actions from './uiActions';

const getDefaultState = (): Store.IUiState => ({
  isNotationMenuVisible: false
});

export const uiReducer = (state = getDefaultState(), action: actions.UiActions): Store.IUiState => {
  const nextState = Object.assign({}, state);

  switch(action.type) {

    case actions.SET_NOTATION_MENU_VISIBILITY:
      nextState.isNotationMenuVisible = action.payload.notationMenuVisibility;
      return nextState;

    default:
      return nextState;
  }
}
