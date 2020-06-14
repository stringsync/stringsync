import { viewportSlice, setBreakpoint } from './viewportSlice';
import { EnhancedStore, configureStore } from '@reduxjs/toolkit';
import { getViewport } from './getViewport';
import { Breakpoint } from './types';

let store: EnhancedStore;

beforeEach(() => {
  store = configureStore({
    reducer: {
      viewport: viewportSlice.reducer,
    },
  });
});

it('initializes state', () => {
  expect(store.getState().viewport).toStrictEqual(getViewport('xs'));
});

it.each(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as Breakpoint[])('sets breakpoints', (breakpoint) => {
  store.dispatch(setBreakpoint({ breakpoint }));
  expect(store.getState().viewport).toStrictEqual(getViewport(breakpoint));
});
