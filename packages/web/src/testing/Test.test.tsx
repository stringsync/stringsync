import { render } from '@testing-library/react';
import React from 'react';
import { Test } from './Test';

describe('Test', () => {
  it('renders without crashing', () => {
    const { container } = render(<Test />);
    expect(container).toBeInTheDocument();
  });
});
