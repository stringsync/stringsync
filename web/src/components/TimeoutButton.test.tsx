import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { TimeoutButton } from './TimeoutButton';

describe('TimeoutButton', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <TimeoutButton timeoutMs={0}>button</TimeoutButton>
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
