import { getStore, RootState, Actions, ThunkContext } from '../store';
import { DeepPartial, Dispatch } from 'redux';
import { StringSyncClient } from '../client';

class DummyClient implements StringSyncClient {
  hello() {
    return Promise.resolve('Hi');
  }
}

export const getTestStore = (
  partialPreloadedState?: DeepPartial<RootState>
) => {
  const client = new DummyClient();
  const store = getStore(client, partialPreloadedState);
  const thunkArgs: [Dispatch<Actions>, () => RootState, ThunkContext] = [
    store.dispatch,
    store.getState,
    { client },
  ];
  return { client, store, thunkArgs };
};
