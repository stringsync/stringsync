import React from 'react';
import { ReturnToRoute } from './ReturnToRoute';
import { render } from '@testing-library/react';
import { AppStore, createStore } from '../store';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { createMemoryHistory } from 'history';

const Dummy = () => <div data-testid="dummy"></div>;

let store: AppStore;

beforeEach(() => {
  store = createStore();
});

it('sets returnToRoute when mounted', () => {
  const history = createMemoryHistory();

  history.push('/dummy?foo=bar#baz');

  const { queryByTestId } = render(
    <Provider store={store}>
      <Router history={history}>
        <ReturnToRoute component={Dummy} />
      </Router>
    </Provider>
  );

  expect(queryByTestId('dummy')).toBeInTheDocument();
  expect(store.getState().history.returnToRoute).toBe('/dummy?foo=bar#baz');
});
