import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import { UserIndex } from './UserIndex';

describe('UserIndex', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <UserIndex />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
