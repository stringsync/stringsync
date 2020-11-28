import React from 'react';
import { Login } from './Login';
import { render } from '@testing-library/react';
import { Test } from '../../testing';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <Login />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
