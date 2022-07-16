import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { SplitPaneLayout } from './SplitPaneLayout';

describe('SplitPaneLayout', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <SplitPaneLayout />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
