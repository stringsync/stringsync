import { getStore } from './getStore';
import { getPreloadedState } from './getPreloadedState';
import { StringSyncClient } from '../client';

class DummyClient implements StringSyncClient {
  hello() {
    return Promise.resolve('hello');
  }
}

it('runs without crashing', () => {
  expect(getStore).not.toThrow();
});

it('preloads the state', () => {
  const client = new DummyClient();
  const store = getStore(client);

  const state = store.getState();
  const preloadedState = getPreloadedState();

  expect(state).toEqual(preloadedState);
});
