import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Tags } from './Tags';

describe('Tags', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Tags tags={[]} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
