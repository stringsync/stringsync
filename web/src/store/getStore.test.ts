import { getStore } from './getStore';
import { getPreloadedState } from './getPreloadedState';
import { createApolloClient } from '../util';

it('runs without crashing', () => {
  expect(getStore).not.toThrow();
});

it('preloads the state', () => {
  const apollo = createApolloClient();
  const store = getStore(apollo);

  const state = store.getState();
  const preloadedState = getPreloadedState();

  expect(state).toEqual(preloadedState);
});
