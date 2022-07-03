import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { ScrollBehavior } from './ScrollBehavior';

describe('ScrollBehavior', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <ScrollBehavior />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
