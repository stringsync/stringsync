import {
  combineReducers,
  createStore as doCreateStore,
  applyMiddleware,
  compose,
} from 'redux';
import { getPreloadedState } from './getPreloadedState';
import thunk from 'redux-thunk';
import { viewportReducer } from './modules/viewport';
import { deviceReducer } from './modules/device';
import { authReducer } from './modules/auth';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';

const REDUX_DEVTOOLS_KEY = '__REDUX_DEVTOOLS_EXTENSION__';

const rootReducer = combineReducers({
  viewport: viewportReducer,
  device: deviceReducer,
  auth: authReducer,
});

const preloadedState = getPreloadedState();

const createStore = (apollo: ApolloClient<NormalizedCacheObject>) => {
  const middlewares = [thunk.withExtraArgument({ apollo })];
  let reduxDevtools = (window as any)[REDUX_DEVTOOLS_KEY] || compose;

  return doCreateStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware(...middlewares), reduxDevtools())
  );
};

export default createStore;
