import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Notation } from './Notation';

describe('Notation', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Notation notation={null} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
