import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { FullHeightDiv } from './FullHeightDiv';

describe('FullHeightDiv', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <FullHeightDiv />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
