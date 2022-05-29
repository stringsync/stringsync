import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Box } from './Box';

describe('Box', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Box />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
