import React from 'react';
import { render } from '@testing-library/react';
import { createStore } from '../store';
import { App } from './App';

it('renders without crashing', () => {
  const store = createStore();
  const { container } = render(<App store={store} />);
  expect(container).toBeInTheDocument();
});
