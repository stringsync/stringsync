import { render } from '@testing-library/react';
import React from 'react';
import { Test } from '../../testing';
import { Menu } from './Menu';

describe('Menu', () => {
  it('renders without crashing', () => {
    const { container } = render(
      <Test>
        <Menu />
      </Test>
    );

    expect(container).toBeInTheDocument();
  });
});
