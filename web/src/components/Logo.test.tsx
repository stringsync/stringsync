import { render } from '@testing-library/react';
import React from 'react';
import { Logo } from './Logo';

describe('Logo', () => {
  it('renders without crashing', () => {
    const { container } = render(<Logo size={22} />);
    expect(container).toBeInTheDocument();
  });
});
