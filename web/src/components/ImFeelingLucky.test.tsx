import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { ImFeelingLucky } from './ImFeelingLucky';

describe('ImFeelingLucky', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <ImFeelingLucky />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
