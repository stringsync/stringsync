import React from 'react';
import { Wordmark } from './Wordmark';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Wordmark, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
