import React from 'react';
import App from './App';
import Root from '../root/Root';
import createStore from '../../store/createStore';
import { render } from '@testing-library/react';
import { Store } from '../../store';

let store: Store;
let component: JSX.Element;

beforeEach(() => {
  store = createStore();
  component = (
    <Root store={store}>
      <App />
    </Root>
  );
});

it('renders without crashing', () => {
  const { container } = render(component);
  expect(container).toBeInTheDocument();
});

it('opens on the landing page', () => {
  const { getByTestId } = render(component);
  expect(getByTestId('landing')).toBeInTheDocument();
});
