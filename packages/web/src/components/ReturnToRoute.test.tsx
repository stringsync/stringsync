import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import React from 'react';
import { Provider } from 'react-redux';
import { Router } from 'react-router';
import { AppStore, createStore } from '../store';
import { ReturnToRoute } from './ReturnToRoute';

describe('ReturnToRoute', () => {
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
});
