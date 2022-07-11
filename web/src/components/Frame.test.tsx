import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Frame } from './Frame';

describe('Frame', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Frame>
          <div>foo</div>
          <div>bar</div>
        </Frame>
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
