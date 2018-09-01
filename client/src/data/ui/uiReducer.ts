import * as actions from './uiActions';

const getDefaultState = (): Store.IUiState => ({
  focusedScrollElement: 'app-top',
  isFretboardVisible: false,
  isLoopVisible: false,
  isNotationMenuVisible: false,
  isPianoVisible: false
});

export const uiReducer = (state = getDefaultState(), action: actions.UiActions): Store.IUiState => {
  let nextState = Object.assign({}, state);

  switch(action.type) {

    case actions.FOCUS_SCROLL_ELEMENT:
      nextState.focusedScrollElement = action.payload.focusedScrollElement;
      return nextState;

    case actions.RESET:
      nextState = getDefaultState();
      return nextState;

    case actions.SET_NOTATION_MENU_VISIBILITY:
      nextState.isNotationMenuVisible = action.payload.notationMenuVisibility;
      return nextState;

    case actions.SET_LOOP_VISIBILITY:
      nextState.isLoopVisible = action.payload.loopVisibility;
      return nextState;

    case actions.SET_FRETBOARD_VISIBILITY:
      nextState.isFretboardVisible = action.payload.fretboardVisibility;
      return nextState;

    case actions.SET_PIANO_VISIBILITY:
      nextState.isPianoVisible = action.payload.pianoVisibility;
      return nextState;

    default:
      return nextState;
  }
}
