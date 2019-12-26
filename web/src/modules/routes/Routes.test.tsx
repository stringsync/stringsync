import React from 'react';
import { Routes } from './Routes';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(Routes, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
