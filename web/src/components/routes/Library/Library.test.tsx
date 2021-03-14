import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../../../testing';
import Library from './Library';

describe('Library', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Library />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
