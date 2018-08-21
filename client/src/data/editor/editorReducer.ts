import * as actions from './editorActions';

const getDefaultState = (): Store.IEditorState => ({
  elementIndex: null,
  enabled: false,
  measureIndex: null
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

    case actions.SET_MEASURE_INDEX:
      nextState.measureIndex = action.payload.measureIndex;
      return nextState;

    default:
      return nextState;
  }
}
