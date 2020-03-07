import { getStore, RootState, Actions, ThunkContext } from '../store';
import { DeepPartial, Dispatch } from 'redux';
import { Client } from '../client';

export const getTestStore = (
  partialPreloadedState?: DeepPartial<RootState>
) => {
  const client = Client.create(Client.TEST_URI);
  const store = getStore(client, partialPreloadedState);
  const thunkArgs: [Dispatch<Actions>, () => RootState, ThunkContext] = [
    store.dispatch,
    store.getState,
    { client },
  ];
  return { client, store, thunkArgs };
};
