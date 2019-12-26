import React from 'react';
import { Fallback } from './Fallback';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Fallback, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
