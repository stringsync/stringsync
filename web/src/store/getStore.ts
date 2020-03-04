import {
  combineReducers,
  createStore,
  applyMiddleware,
  compose,
  DeepPartial,
  Store,
} from 'redux';
import {
  viewportReducer,
  deviceReducer,
  authReducer,
  emailReducer,
} from './modules';
import { getPreloadedState } from './getPreloadedState';
import thunk from 'redux-thunk';
import { RootState, Actions } from './types';
import { merge } from 'lodash';
import { StringSyncClient } from '../client/types';

const REDUX_DEVTOOLS_KEY = '__REDUX_DEVTOOLS_EXTENSION__';

const rootReducer = combineReducers({
  viewport: viewportReducer,
  device: deviceReducer,
  auth: authReducer,
  email: emailReducer,
});

export const getStore = (
  client: StringSyncClient,
  partialPreloadedState?: DeepPartial<RootState>
): Store<RootState, Actions> => {
  const middlewares = [thunk.withExtraArgument({ client })];
  const reduxDevtools = (window as any)[REDUX_DEVTOOLS_KEY] || compose;
  const preloadedState = merge(getPreloadedState(), partialPreloadedState);

  return createStore(
    rootReducer,
    preloadedState,
    compose(applyMiddleware(...middlewares), reduxDevtools())
  );
};
