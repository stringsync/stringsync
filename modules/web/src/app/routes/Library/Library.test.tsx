import React from 'react';
import { render } from '@testing-library/react';
import { Test } from '../../testing';
import Library from './Library';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <Library />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
