import { render } from '@testing-library/react';
import { noop } from 'lodash';
import React from 'react';
import { Test } from '../testing';
import { Rect } from './Rect';

describe('Rect', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Rect onResize={noop} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
