import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { IntersectionTrigger } from './IntersectionTrigger';

describe('IntersectionTrigger', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <IntersectionTrigger />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
