import React from 'react';
import { asReturnToRoute } from './asReturnToRoute';
import { Provider } from 'react-redux';
import { render } from '@testing-library/react';
import { getInitialHistoryState, getStore } from '../store';
import { Route, Router } from 'react-router-dom';
import { Client } from '../client';
import { createMemoryHistory } from 'history';

const Dummy = asReturnToRoute(() => <div data-testid="dummy" />);
const Routes = () => <Route path="/dummy" component={Dummy} />;

it('sets the returnToRoute in the store', () => {
  const store = getStore(Client.create(Client.TEST_URI));
  const history = createMemoryHistory();

  expect(store.getState().history.returnToRoute).toBe(
    getInitialHistoryState().returnToRoute
  );

  history.push('/dummy?foo=bar#baz');
  const { queryByTestId } = render(
    <Provider store={store}>
      <Router history={history}>
        <Routes />
      </Router>
    </Provider>
  );

  expect(queryByTestId('dummy')).toBeInTheDocument();
  expect(store.getState().history.returnToRoute).toBe('/dummy?foo=bar#baz');
});
