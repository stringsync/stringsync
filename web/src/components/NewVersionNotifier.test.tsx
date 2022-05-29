import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { NewVersionNotifier } from './NewVersionNotifier';

describe('NewVersionNotifier', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NewVersionNotifier />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
