import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { SplitPane } from './SplitPane';

describe('SplitPane', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <SplitPane>
          <div>foo</div>
          <div>bar</div>
        </SplitPane>
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
