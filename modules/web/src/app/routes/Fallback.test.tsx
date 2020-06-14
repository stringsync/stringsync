import React from 'react';
import { Fallback } from './Fallback';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { container } = render(<Fallback />);
  expect(container).toBeInTheDocument();
});
