import {
  combineReducers,
  createStore as doCreateStore,
  applyMiddleware,
  compose,
} from 'redux';
import { getPreloadedState } from './getPreloadedState';
import thunk from 'redux-thunk';
import createApolloClient from '../util/ createApolloClient';
import viewportReducer from './modules/viewport/reducer';
import deviceReducer from './modules/device/reducer';
import authReducer from './modules/auth/reducer';

const reducer = combineReducers({
  viewport: viewportReducer,
  device: deviceReducer,
  auth: authReducer,
});
const preloadedState = getPreloadedState();

const createStore = () => {
  const apollo = createApolloClient();
  const middlewares = [thunk.withExtraArgument({ apollo })];
  const reduxDevtools = (window as any).__REDUX_DEVTOOLS_EXTENSION__ || compose;

  return doCreateStore(
    reducer,
    preloadedState,
    compose(
      applyMiddleware(...middlewares),
      reduxDevtools()
    )
  );
};

export default createStore;
