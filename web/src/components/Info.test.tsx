import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { Info } from './Info';

describe('Info', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Info notation={null} skeleton />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
