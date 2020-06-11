import React from 'react';
import { Logo } from './Logo';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { container } = render(<Logo fill={'red'} width={24} height={24} />);
  expect(container).toBeInTheDocument();
});
