import React from 'react';
import App from './App';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing/';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(App, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});

it('opens on the landing page', () => {
  const { TestComponent } = getTestComponent(App, {});
  const { getByTestId } = render(<TestComponent />);
  expect(getByTestId('landing')).toBeInTheDocument();
});
