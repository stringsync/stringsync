import { render } from '@testing-library/react';
import React from 'react';
import { Fallback } from './Fallback';

describe('Fallback', () => {
  it('renders without crashing', () => {
    const { container } = render(<Fallback />);
    expect(container).toBeInTheDocument();
  });
});
