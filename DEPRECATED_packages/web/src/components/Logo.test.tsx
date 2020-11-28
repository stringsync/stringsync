import React from 'react';
import { render } from '@testing-library/react';
import { Logo } from './Logo';

it('renders without crashing', () => {
  const { container } = render(<Logo size={22} />);
  expect(container).toBeInTheDocument();
});
