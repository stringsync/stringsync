import {
  combineReducers,
  createStore as doCreateStore,
  applyMiddleware,
  compose,
  DeepPartial,
} from 'redux';
import { getPreloadedState } from './getPreloadedState';
import thunk from 'redux-thunk';
import { viewportReducer } from './modules/viewport';
import { deviceReducer } from './modules/device';
import { authReducer } from './modules/auth';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { RootState } from './types';
import { merge } from 'lodash';

const REDUX_DEVTOOLS_KEY = '__REDUX_DEVTOOLS_EXTENSION__';

const rootReducer = combineReducers({
  viewport: viewportReducer,
  device: deviceReducer,
  auth: authReducer,
});

export const createStore = (
  apollo: ApolloClient<NormalizedCacheObject>,
  partialPreloadedState?: DeepPartial<RootState>
) => {
  const middlewares = [thunk.withExtraArgument({ apollo })];
  const reduxDevtools = (window as any)[REDUX_DEVTOOLS_KEY] || compose;
  const preloadedState = merge(getPreloadedState(), partialPreloadedState);

  return doCreateStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware(...middlewares), reduxDevtools())
  );
};
