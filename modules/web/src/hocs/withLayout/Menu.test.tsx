import React from 'react';
import { Menu } from './Menu';
import { render } from '@testing-library/react';
import { Test } from '../../testing';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <Menu />
    </Test>
  );

  expect(container).toBeInTheDocument();
});
