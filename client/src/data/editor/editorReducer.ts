import * as actions from './editorActions';

const getDefaultState = (): Store.IEditorState => ({
  elementIndex: -1,
  enabled: false,
});

export const editorReducer = (state = getDefaultState(), action: actions.EditorActions): Store.IEditorState => {
  const nextState = Object.assign({}, state);

  switch(action.type) {

    case actions.SET_ENABLED:
      nextState.enabled = action.payload.enabled;
      return nextState;

    case actions.SET_ELEMENT_INDEX:
      nextState.elementIndex = action.payload.elementIndex;
      return nextState;

    default:
      return nextState;
  }
}
