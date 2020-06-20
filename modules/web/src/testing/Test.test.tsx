import React from 'react';
import { Test } from './Test';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { container } = render(<Test />);
  expect(container).toBeInTheDocument();
});
