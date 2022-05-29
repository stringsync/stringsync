import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { ForgotPassword } from './ForgotPassword';

describe('ForgotPassword', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <ForgotPassword />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
