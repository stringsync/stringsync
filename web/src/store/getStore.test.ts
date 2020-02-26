import { getStore } from './getStore';
import { getPreloadedState } from './getPreloadedState';
import { Client } from '../client';

it('runs without crashing', () => {
  expect(getStore).not.toThrow();
});

it('preloads the state', () => {
  const client = Client.create('');
  const store = getStore(client);

  const state = store.getState();
  const preloadedState = getPreloadedState();

  expect(state).toEqual(preloadedState);
});
