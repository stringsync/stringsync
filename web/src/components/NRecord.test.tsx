import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { NRecord } from './NRecord';

describe('NRecord', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NRecord />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
