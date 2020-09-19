import React from 'react';
import { NoneLayout } from './NoneLayout';
import { Test } from '../../testing';
import { render } from '@testing-library/react';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <NoneLayout />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
