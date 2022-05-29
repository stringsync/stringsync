import { render } from '@testing-library/react';
import { noop } from 'lodash';
import React from 'react';
import { Test } from '../../testing';
import { Landing } from './Landing';

describe('Landing', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Landing onMount={noop} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
