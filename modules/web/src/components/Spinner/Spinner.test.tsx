import React from 'react';
import { Spinner } from './Spinner';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { container } = render(<Spinner />);
  expect(container).toBeInTheDocument();
});
