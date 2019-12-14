import React from 'react';
import Library from './Library';
import createStore from '../../store/createStore';
import Root from '../root/Root';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const store = createStore();
  const { container } = render(
    <Root store={store}>
      <Library />
    </Root>
  );
  expect(container).toBeInTheDocument();
});
