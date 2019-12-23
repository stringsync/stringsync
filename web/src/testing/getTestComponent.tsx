import React from 'react';
import { createApolloClient } from '../util';
import { createStore } from '../store';
import Root from '../modules/root/Root';

export const getTestComponent = function<P>(
  Component: React.ComponentType<P>,
  props: P
) {
  const apollo = createApolloClient();
  const store = createStore(apollo);

  const TestComponent = () => (
    <Root store={store}>
      <Component {...props} />
    </Root>
  );

  return { apollo, store, TestComponent };
};
