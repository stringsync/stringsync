import * as actions from './editorActions';

const getDefaultState = (): Store.IEditorState => ({
  autosave: true,
  elementIndex: -1,
  enabled: false,
  errors: [],
  lastRenderedAt: new Date().getTime(),
  lastUpdatedAt: new Date().getTime(),
  vextab: null,
});

export const editorReducer = (state = getDefaultState(), action: actions.EditorActions): Store.IEditorState => {
  const nextState = Object.assign({}, state);

  switch(action.type) {

    case actions.APPEND_ERRORS:
      nextState.errors = [...nextState.errors, ...action.payload.errors];
      return nextState;

    case actions.NOTIFY_RENDER:
      nextState.lastRenderedAt = new Date().getTime();
      return nextState;

    case actions.NOTIFY_UPDATED:
      nextState.lastUpdatedAt = new Date().getTime();
      return nextState;

    case actions.REMOVE_ERRORS:
      nextState.errors = [];
      return nextState;

    case actions.SET_ENABLED:
      nextState.enabled = action.payload.enabled;
      return nextState;

    case actions.SET_ELEMENT_INDEX:
      nextState.elementIndex = action.payload.elementIndex;
      return nextState;

    case actions.SET_VEXTAB:
      nextState.vextab = action.payload.vextab;
      return nextState;

    case actions.SET_AUTOSAVE:
      nextState.autosave = action.payload.autosave;
      return nextState;

    default:
      return nextState;
  }
}
