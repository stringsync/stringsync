import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Library2 } from './Library2';

describe('Library2', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Library2 />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
