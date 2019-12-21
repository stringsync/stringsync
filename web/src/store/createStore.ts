import {
  combineReducers,
  createStore as doCreateStore,
  applyMiddleware,
  compose,
} from 'redux';
import { getPreloadedState } from './getPreloadedState';
import thunk from 'redux-thunk';
import viewportReducer from './modules/viewport/reducer';
import deviceReducer from './modules/device/reducer';
import authReducer from './modules/auth/reducer';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';

const REDUX_DEVTOOLS_KEY = '__REDUX_DEVTOOLS_EXTENSION__';

const reducer = combineReducers({
  viewport: viewportReducer,
  device: deviceReducer,
  auth: authReducer,
});

const preloadedState = getPreloadedState();

const createStore = (apollo: ApolloClient<NormalizedCacheObject>) => {
  const middlewares = [thunk.withExtraArgument({ apollo })];
  let reduxDevtools = (window as any)[REDUX_DEVTOOLS_KEY] || compose;

  return doCreateStore(
    reducer,
    preloadedState,
    compose(applyMiddleware(...middlewares), reduxDevtools())
  );
};

export default createStore;
