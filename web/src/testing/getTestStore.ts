import { getStore, RootState } from '../store';
import { DeepPartial } from 'redux';
import { Client } from '../client';

export const getTestStore = (
  partialPreloadedState?: DeepPartial<RootState>
) => {
  const client = Client.create('');
  const store = getStore(client, partialPreloadedState);
  return { client, store };
};
