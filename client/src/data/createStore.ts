import { combineReducers, createStore } from 'redux';
import { notationsReducer as notations } from './notations';
import { sessionReducer as session } from './session';
import preloadedState from './preloadedState';

// Reducer
const reducer = combineReducers({
  notations,
  session
});

// Store
const doCreateStore = () => createStore(reducer, preloadedState);

export default doCreateStore;
