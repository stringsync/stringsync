import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Select } from './Select';

describe('Select', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Select options={[{ value: 'foo', label: 'foo' }]} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
