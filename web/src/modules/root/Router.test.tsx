import React from 'react';
import { Router } from './Router';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Router, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
