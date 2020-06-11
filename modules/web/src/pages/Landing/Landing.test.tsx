import React from 'react';
import Landing from './Landing';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Landing, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
