import { render } from '@testing-library/react';
import React from 'react';
import { Wordmark } from '../Wordmark';

describe('Wordmark', () => {
  it('renders without crashing', () => {
    const { container } = render(<Wordmark />);
    expect(container).toBeInTheDocument();
  });
});
