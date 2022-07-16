import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { SplitPane } from './SplitPane';

describe('SplitPane', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <SplitPane pane1Content={<div>foo</div>} pane2Content={<div>bar</div>} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
