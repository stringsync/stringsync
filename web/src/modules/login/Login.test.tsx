import React from 'react';
import Root from '../root/Root';
import Login from './Login';
import createStore from '../../store/createStore';
import { Store } from '../../store';
import { render } from '@testing-library/react';

let store: Store;
let component: JSX.Element;

beforeEach(() => {
  store = createStore();
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
