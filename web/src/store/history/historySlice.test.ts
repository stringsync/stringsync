import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import { historySlice, setReturnToRoute } from './historySlice';
import { HistoryState } from './types';

describe('historySlice', () => {
  let store: EnhancedStore<{ history: HistoryState }>;

  beforeEach(() => {
    store = configureStore({
      reducer: {
        history: historySlice.reducer,
      },
    });
  });

  it('initializes state', () => {
    expect(store.getState().history.returnToRoute).toStrictEqual('/library');
  });

  it('sets return to route', () => {
    const route = '/foo?bar#baz';
    store.dispatch(setReturnToRoute(route));
    expect(store.getState().history.returnToRoute).toBe(route);
  });
});
