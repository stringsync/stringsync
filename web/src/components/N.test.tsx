import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { N } from './N';

describe('N', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <N />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
