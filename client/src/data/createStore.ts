import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as _createStore } from 'redux';
import { Store } from 'react-redux';
import { viewportReducer, videoReducer, notationsReducer, usersReducer, tagsReducer } from './';

// Middleware
const middleware = applyMiddleware(thunk);

// Reducer
const reducer = combineReducers({
  notations: notationsReducer,
  tags: tagsReducer,
  users: usersReducer,
  video: videoReducer,
  viewport: viewportReducer
});

// Store
const createStore = (): Store<{}> => {
  const store = _createStore(reducer, {}, middleware);
  window.ss.store = store;
  return store;
}

export default createStore;
