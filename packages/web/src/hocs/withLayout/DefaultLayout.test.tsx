import React from 'react';
import { DefaultLayout } from './DefaultLayout';
import { render } from '@testing-library/react';
import { Test } from '../../testing';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <DefaultLayout />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
