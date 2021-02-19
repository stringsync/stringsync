import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../../../testing';
import { Login } from './Login';

describe('Login', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Login />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
