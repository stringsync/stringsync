import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { ConfirmEmail } from './ConfirmEmail';

describe('ConfirmEmail', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <ConfirmEmail />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
