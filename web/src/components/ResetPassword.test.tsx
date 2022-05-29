import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { ResetPassword } from './ResetPassword';

describe('ResetPassword', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <ResetPassword />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
