import thunk from 'redux-thunk';
import { applyMiddleware, combineReducers, createStore } from 'redux';
import { notationsReducer as notations } from './notations';
import { sessionReducer as session } from './session';
import preloadedState from './preloadedState';

// Middleware
const middleware = applyMiddleware(thunk);

// Reducer
const reducer = combineReducers({
  notations,
  session
});

// Store
const doCreateStore = () => createStore(reducer, preloadedState, middleware);

export default doCreateStore;
