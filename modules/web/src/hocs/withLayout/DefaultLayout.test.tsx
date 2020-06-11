import React from 'react';
import { DefaultLayout } from './DefaultLayout';
import { render } from '@testing-library/react';
import { getTestComponent } from '../../testing';

it('renders without crashing', () => {
  const { TestComponent } = getTestComponent(DefaultLayout, {});
  const { container } = render(<TestComponent />);
  expect(container).toBeInTheDocument();
});
