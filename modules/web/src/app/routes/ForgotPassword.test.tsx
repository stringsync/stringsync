import React from 'react';
import { render } from '@testing-library/react';
import { Test } from '../../testing';
import { ForgotPassword } from './ForgotPassword';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <ForgotPassword />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
