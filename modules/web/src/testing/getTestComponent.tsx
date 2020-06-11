import React from 'react';
import { RootState } from '../store';
import { getTestStore } from './getTestStore';
import Root from '../pages/Root/Root';
import { DeepPartial } from '@stringsync/common';

export const getTestComponent = function<P>(
  Component: React.ComponentType<P>,
  props: P,
  partialPreloadedState?: DeepPartial<RootState>
) {
  const { store, client } = getTestStore(partialPreloadedState);

  const TestComponent = () => (
    <Root store={store} client={client}>
      <Component {...props} />
    </Root>
  );

  return { client, store, TestComponent };
};
