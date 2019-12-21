import React from 'react';
import Landing from './Landing';
import createStore from '../../store/createStore';
import Root from '../root/Root';
import { render } from '@testing-library/react';
import { Store } from '../../store';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { createApolloClient } from '../../util/';

let apollo: ApolloClient<NormalizedCacheObject>;
let store: Store;
let component: JSX.Element;

beforeEach(() => {
  apollo = createApolloClient();
  store = createStore(apollo);
  component = (
    <Root store={store}>
      <Landing />
    </Root>
  );
});

it('renders without crashing', () => {
  const { container } = render(component);
  expect(container).toBeInTheDocument();
});
