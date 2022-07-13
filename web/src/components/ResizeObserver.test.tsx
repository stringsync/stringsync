import { render } from '@testing-library/react';
import { noop } from 'lodash';
import React from 'react';
import { Test } from '../testing';
import { ResizeObserver } from './ResizeObserver';

describe('ResizeObserver', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <ResizeObserver onResize={noop} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
