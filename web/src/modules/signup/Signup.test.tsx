import React from 'react';
import { getTestComponent } from '../../testing';
import Signup from './Signup';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Signup, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
