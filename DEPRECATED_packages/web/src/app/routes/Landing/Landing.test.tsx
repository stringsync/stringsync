import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../../../testing';
import { Landing } from './Landing';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <Landing />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
