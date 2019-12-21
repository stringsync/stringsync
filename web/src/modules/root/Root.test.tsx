import React from 'react';
import Root from './Root';
import createStore from '../../store/createStore';
import { render } from '@testing-library/react';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { Store } from '../../store';
import createApolloClient from '../../util/ createApolloClient';

let apollo: ApolloClient<NormalizedCacheObject>;
let store: Store;
let component: JSX.Element;

beforeEach(() => {
  apollo = createApolloClient();
  store = createStore(apollo);
  component = <Root store={store} />;
});

it('renders without crashing', () => {
  const { container } = render(component);
  expect(container).toBeInTheDocument();
});
