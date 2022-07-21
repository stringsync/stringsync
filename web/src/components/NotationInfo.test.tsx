import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { NotationInfo } from './NotationInfo';

describe('NotationInfo', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NotationInfo notation={null} />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
