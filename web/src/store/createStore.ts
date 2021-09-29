import { configureStore } from '@reduxjs/toolkit';
import { DeepPartial } from '../util/types';
import { authSlice } from './auth';
import { historySlice } from './history';
import { swSlice } from './sw';
import { AppStore, RootState } from './types';

export const createStore = (preloadedState: DeepPartial<RootState> = {}): AppStore => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
      history: historySlice.reducer,
      sw: swSlice.reducer,
    },
    preloadedState,
  });
};
