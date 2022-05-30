import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../testing';
import NotationShow from './NotationShow';

describe('NotationShow', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <NotationShow />
      </Test>
    );
    expect(container).toBeInTheDocument();
  });
});
