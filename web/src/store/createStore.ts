import { combineReducers, createStore } from 'redux';
import { getPreloadedState } from './getPreloadedState';

const reducer = combineReducers({});
const preloadedState = getPreloadedState();

export default () => createStore(reducer, preloadedState);
