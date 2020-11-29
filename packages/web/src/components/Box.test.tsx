import React from 'react';
import { Box } from './Box';
import { Test } from '../testing';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <Box />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
