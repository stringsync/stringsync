import { combineReducers, createStore as doCreateStore } from 'redux';
import { getPreloadedState } from './getPreloadedState';
import viewportReducer from './modules/viewport/reducer';
import deviceReducer from './modules/device/reducer';
import authReducer from './modules/auth/reducer';

const reducer = combineReducers({
  viewport: viewportReducer,
  device: deviceReducer,
  auth: authReducer,
});
const preloadedState = getPreloadedState();

const reduxDevtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__;

const createStore = () =>
  doCreateStore(reducer, preloadedState, reduxDevtools && reduxDevtools());

export default createStore;
