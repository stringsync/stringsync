import React from 'react';
import { render } from '@testing-library/react';
import { Test } from '../../testing';
import Signup from './Signup';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <Signup />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
