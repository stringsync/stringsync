import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore as _createStore } from 'redux';
import { Store } from 'react-redux';
import { viewportReducer } from './';

// Middleware
const middleware = applyMiddleware(thunk);

// Reducer
const reducer = combineReducers({
  viewport: viewportReducer
});

// Store
const createStore = (): Store<{}> => {
  const store = _createStore(reducer, {}, middleware);
  window.ss.store = store;
  return store;
}

export default createStore;
