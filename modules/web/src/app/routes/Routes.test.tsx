import React from 'react';
import { render } from '@testing-library/react';
import { Test } from '../../testing';
import { Routes } from './Routes';

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <Routes />
    </Test>
  );
  expect(container).toBeInTheDocument();
});
