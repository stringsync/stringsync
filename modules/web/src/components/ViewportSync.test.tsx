import React from 'react';
import { render } from '@testing-library/react';
import { createStore } from '../store';
import { Test } from '../testing';
import { ViewportSync } from './ViewportSync';

it('renders without crashing', () => {
  const store = createStore();

  const { container } = render(
    <Test store={store}>
      <ViewportSync />
    </Test>
  );

  expect(container).toBeInTheDocument();
});
