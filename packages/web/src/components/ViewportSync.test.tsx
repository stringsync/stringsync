import React from 'react';
import { render } from '@testing-library/react';
import { createStore, Breakpoint, AppStore } from '../store';
import { Test } from '../testing';
import { ViewportSync } from './ViewportSync';

let store: AppStore;

beforeEach(() => {
  store = createStore();
});

it('renders without crashing', () => {
  const { container } = render(
    <Test>
      <ViewportSync />
    </Test>
  );

  expect(container).toBeInTheDocument();
});

it.each([
  { query: '(max-width: 575px)', breakpoint: 'xs' },
  { query: '(max-width: 767px)', breakpoint: 'sm' },
  { query: '(max-width: 991px)', breakpoint: 'md' },
  { query: '(max-width: 1199px)', breakpoint: 'lg' },
  { query: '(max-width: 1599px)', breakpoint: 'xl' },
] as { query: string; breakpoint: Breakpoint }[])('syncs the viewport with the store', (t) => {
  jest.spyOn(window, 'matchMedia').mockImplementation((query) => ({
    matches: query === t.query, // match query1
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  }));

  render(
    <Test store={store}>
      <ViewportSync />
    </Test>
  );

  expect(store.getState().viewport.breakpoint).toStrictEqual(t.breakpoint);
});
