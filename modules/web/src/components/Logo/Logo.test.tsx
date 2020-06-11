import React from 'react';
import { Logo } from './Logo';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { container } = render(<Logo />);
  expect(container).toBeInTheDocument();
});
