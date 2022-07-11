import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { SlidingWindow } from './SlidingWindow';

describe('SlidingWindow', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <SlidingWindow>
          <div>foo</div>
          <div>bar</div>
        </SlidingWindow>
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
