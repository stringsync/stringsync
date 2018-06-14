import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as _createStore } from 'redux';
import { Store } from 'react-redux';
import { viewportReducer, videoReducer, notationsReducer, usersReducer } from './';

// Middleware
const middleware = applyMiddleware(thunk);

// Reducer
const reducer = combineReducers({
  notations: notationsReducer,
  video: videoReducer,
  viewport: viewportReducer,
  users: usersReducer
});

// Store
const createStore = (): Store<{}> => {
  const store = _createStore(reducer, {}, middleware);
  window.ss.store = store;
  return store;
}

export default createStore;
