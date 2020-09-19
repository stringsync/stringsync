import React from 'react';
import { render } from '@testing-library/react';
import { Wordmark } from './Wordmark';

it('renders without crashing', () => {
  const { container } = render(<Wordmark />);
  expect(container).toBeInTheDocument();
});
