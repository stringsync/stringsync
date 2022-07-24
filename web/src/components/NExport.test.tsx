import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { NExport } from './NExport';

describe('NExport', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NExport />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
