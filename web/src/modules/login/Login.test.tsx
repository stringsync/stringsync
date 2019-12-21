import React from 'react';
import Root from '../root/Root';
import Login from './Login';
import createStore from '../../store/createStore';
import { Store } from '../../store';
import { render } from '@testing-library/react';
import { ApolloClient, NormalizedCacheObject } from 'apollo-boost';
import { createApolloClient } from '../../util';

let apollo: ApolloClient<NormalizedCacheObject>;
let store: Store;
let component: JSX.Element;

beforeEach(() => {
  apollo = createApolloClient();
  store = createStore(apollo);
  component = (
    <Root store={store}>
      <Login />
    </Root>
  );
});

it('renders without crashing', () => {
  const { container } = render(component);
  expect(container).toBeInTheDocument();
});

it('has at least one link to /library', () => {
  const { container } = render(component);

  expect(
    container.querySelectorAll<HTMLAnchorElement>('a[href="/library"]').length
  ).toBeGreaterThan(0);
});

it('has at least one link to /signup', () => {
  const { container } = render(component);

  expect(
    container.querySelectorAll<HTMLAnchorElement>('a[href="/signup"]').length
  ).toBeGreaterThan(0);
});
