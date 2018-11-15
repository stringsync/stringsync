import { combineReducers, createStore } from 'redux';
import { notationsReducer as notations } from './notations';
import { notationReducer as notation } from './notation';
import { sessionReducer as session } from './session';
import { tagsReducer as tags } from './tags';
import preloadedState from './preloadedState';

// Reducer
const reducer = combineReducers({
  notations,
  notation,
  session,
  tags
});

// Store
const doCreateStore = () => createStore(reducer, preloadedState);

export default doCreateStore;
