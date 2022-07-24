import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { NEdit } from './NEdit';

describe('NEdit', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NEdit />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
