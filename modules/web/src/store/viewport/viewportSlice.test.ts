import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { getViewportState } from './getViewportState';
import { Breakpoint, ViewportState } from './types';
import { setBreakpoint, viewportSlice } from './viewportSlice';

describe('viewportSlice', () => {
  let store: EnhancedStore<{ viewport: ViewportState }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        viewport: viewportSlice.reducer,
      },
    });
  });

  it('initializes state', () => {
    expect(store.getState().viewport).toStrictEqual(getViewportState('xs'));
  });

  it.each(['xs', 'sm', 'md', 'lg', 'xl', 'xxl'] as Breakpoint[])('sets breakpoints', (breakpoint) => {
    store.dispatch(setBreakpoint({ breakpoint }));
    expect(store.getState().viewport).toStrictEqual(getViewportState(breakpoint));
  });
});
