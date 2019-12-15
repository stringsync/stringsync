import React from 'react';
import App from './App';
import Root from '../root/Root';
import createStore from '../../store/createStore';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const store = createStore();
  const { container } = render(
    <Root store={store}>
      <App />
    </Root>
  );
  expect(container).toBeInTheDocument();
});

it('opens on the landing page', () => {
  const store = createStore();
  const { getByTestId } = render(
    <Root store={store}>
      <App />
    </Root>
  );
  expect(getByTestId('landing')).toBeInTheDocument();
});
