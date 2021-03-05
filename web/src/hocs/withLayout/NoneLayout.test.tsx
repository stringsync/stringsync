import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../../testing';
import { NoneLayout } from './NoneLayout';

describe('NoneLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NoneLayout />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
