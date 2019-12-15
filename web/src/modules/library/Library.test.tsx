import React from 'react';
import Library from './Library';
import createStore from '../../store/createStore';
import Root from '../root/Root';
import { render } from '@testing-library/react';
import { Store } from '../../store';

let store: Store;
let component: JSX.Element;

beforeEach(() => {
  store = createStore();
  component = (
    <Root store={store}>
      <Library />
    </Root>
  );
});

it('renders without crashing', () => {
  const { container } = render(component);
  expect(container).toBeInTheDocument();
});
