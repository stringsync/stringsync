import React from 'react';
import Library from './Library';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Library, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
