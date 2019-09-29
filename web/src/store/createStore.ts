import {
  combineReducers,
  createStore as doCreateStore,
  applyMiddleware,
  compose,
} from 'redux';
import { getPreloadedState } from './getPreloadedState';
import thunk from 'redux-thunk';
import apollo from '../util/apollo';
import viewportReducer from './modules/viewport/reducer';
import deviceReducer from './modules/device/reducer';
import authReducer from './modules/auth/reducer';
import noop from '../util/noop';

const reducer = combineReducers({
  viewport: viewportReducer,
  device: deviceReducer,
  auth: authReducer,
});
const preloadedState = getPreloadedState();

const middlewares = [thunk.withExtraArgument({ apollo })];
const reduxDevtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ || noop;

const createStore = () =>
  doCreateStore(
    reducer,
    preloadedState,
    compose(
      applyMiddleware(...middlewares),
      reduxDevtools()
    )
  );

export default createStore;
