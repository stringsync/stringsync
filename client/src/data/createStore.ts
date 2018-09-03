import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as _createStore } from 'redux';
import { 
  viewportReducer, videoReducer, sessionReducer,
  notationsReducer, tagsReducer,
  uiReducer, notationReducer, editorReducer,
  maestroReducer
} from './';
import { Store } from 'react-redux';

// Middleware
const middleware = applyMiddleware(thunk);

// Reducer
const reducer = combineReducers({
  editor: editorReducer,
  maestro: maestroReducer,
  notation: notationReducer,
  notations: notationsReducer,
  session: sessionReducer,
  tags: tagsReducer,
  ui: uiReducer,
  video: videoReducer,
  viewport: viewportReducer
});

// Store
const createStore = (): Store<Store.IState> => {
  const store = _createStore(reducer, {}, middleware) as Store<Store.IState>;
  window.ss.store = store;
  return store;
}

export default createStore;
