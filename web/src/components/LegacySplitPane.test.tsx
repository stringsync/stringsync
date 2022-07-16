import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { SplitPane } from './LegacySplitPane';

describe('SplitPane', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <SplitPane handle split="vertical">
          <div>child1</div>
          <div>child2</div>
        </SplitPane>
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
