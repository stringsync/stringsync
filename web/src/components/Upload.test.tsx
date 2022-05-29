import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import Upload from './Upload';

describe('Upload', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Upload />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
