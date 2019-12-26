import React from 'react';
import { StoreViewportSync } from './StoreViewportSync';
import { getTestComponent } from '../../testing';
import { render } from '@testing-library/react';
import { useMedia } from '../../hooks';

jest.mock('../../hooks/useMedia', () => ({
  useMedia: jest.fn(),
}));

afterEach(() => {
  jest.clearAllMocks();
});

it('updates the store with the breakpoint name', () => {
  const breakpointName = 'md';
  (useMedia as jest.Mock).mockReturnValue(breakpointName);

  const { TestComponent, store } = getTestComponent(
    StoreViewportSync,
    {},
    {
      viewport: {
        breakpointName: 'xs',
        xs: true,
        sm: false,
        md: false,
        lg: false,
        xl: false,
        xxl: false,
      },
    }
  );

  render(<TestComponent />);

  expect(store.getState().viewport.breakpointName).toBe(breakpointName);
});
