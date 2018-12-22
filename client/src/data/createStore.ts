import { combineReducers, createStore } from 'redux';
import { notationsReducer as notations } from './notations';
import { notationReducer as notation } from './notation';
import { notationMenuReducer as notationMenu } from './notation-menu';
import { scoreReducer as score } from './score';
import { sessionReducer as session } from './session';
import { tagsReducer as tags } from './tags';
import { videoReducer as video } from './video';
import preloadedState from './preloadedState';

// Reducer
const reducer = combineReducers({
  notations,
  notation,
  notationMenu,
  score,
  session,
  tags,
  video
});

// Store
const doCreateStore = () => createStore(reducer, preloadedState);

export default doCreateStore;
