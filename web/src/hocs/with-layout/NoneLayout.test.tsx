import React from 'react';
import { NoneLayout } from './NoneLayout';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(NoneLayout, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
