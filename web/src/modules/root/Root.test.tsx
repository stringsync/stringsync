import React from 'react';
import Root from './Root';
import createStore from '../../store/createStore';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const store = createStore();
  const { container } = render(<Root store={store} />);
  expect(container).toBeInTheDocument();
});
