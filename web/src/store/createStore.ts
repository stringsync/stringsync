import { combineReducers, createStore as doCreateStore } from 'redux';
import { getPreloadedState } from './getPreloadedState';
import viewportReducer from './modules/viewport/reducer';

const reducer = combineReducers({
  viewport: viewportReducer,
});
const preloadedState = getPreloadedState();

const reduxDevtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

const createStore = () =>
  doCreateStore(reducer, preloadedState, reduxDevtools && reduxDevtools());

export default createStore;
