import { getStore, RootState } from '../store';
import { DeepPartial } from 'redux';
import { createApolloClient } from '../util';

export const getTestStore = (
  partialPreloadedState?: DeepPartial<RootState>
) => {
  const apollo = createApolloClient();
  const store = getStore(apollo, partialPreloadedState);
  return { apollo, store };
};
