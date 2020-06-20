import React from 'react';
import { asReturnToRoute } from './asReturnToRoute';
import { createStore, AppStore } from '../store';
import { render } from '@testing-library/react';
import { createMemoryHistory } from 'history';
import { Route, Router } from 'react-router';
import { Provider } from 'react-redux';

const Dummy: React.FC = asReturnToRoute(() => <div data-testid="dummy"></div>);
const Routes = () => <Route path="/dummy" component={Dummy} />;

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
        <Routes />
      </Router>
    </Provider>
  );

  expect(queryByTestId('dummy')).toBeInTheDocument();
  expect(store.getState().history.returnToRoute).toBe('/dummy?foo=bar#baz');
});
