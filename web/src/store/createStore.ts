import { combineReducers, createStore as doCreateStore } from 'redux';
import { getPreloadedState } from './getPreloadedState';
import screenReducer from './screen/reducer';

const reducer = combineReducers({
  screen: screenReducer,
});
const preloadedState = getPreloadedState();

const reduxDevtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

const createStore = () =>
  doCreateStore(reducer, preloadedState, reduxDevtools && reduxDevtools());

export default createStore;
