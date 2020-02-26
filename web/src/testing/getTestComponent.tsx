import React from 'react';
import { RootState } from '../store';
import { getTestStore } from './getTestStore';
import Root from '../modules/root/Root';
import { DeepPartial } from '../common/types';

export const getTestComponent = function<P>(
  Component: React.ComponentType<P>,
  props: P,
  partialPreloadedState?: DeepPartial<RootState>
) {
  const { store, apollo } = getTestStore(partialPreloadedState);

  const TestComponent = () => (
    <Root store={store}>
      <Component {...props} />
    </Root>
  );

  return { apollo, store, TestComponent };
};
