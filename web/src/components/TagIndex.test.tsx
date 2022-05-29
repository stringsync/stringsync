import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { TagIndex } from './TagIndex';

describe('TagIndex', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <TagIndex />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
