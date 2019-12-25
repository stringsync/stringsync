import React from 'react';
import { createApolloClient } from '../util';
import { createStore, RootState } from '../store';
import Root from '../modules/root/Root';
import { DeepPartial } from 'common/types';

export const getTestComponent = function<P>(
  Component: React.ComponentType<P>,
  props: P,
  partialPreloadedState?: DeepPartial<RootState>
) {
  const apollo = createApolloClient();
  const store = createStore(apollo, partialPreloadedState);

  const TestComponent = () => (
    <Root store={store}>
      <Component {...props} />
    </Root>
  );

  return { apollo, store, TestComponent };
};
