import { configureStore } from '@reduxjs/toolkit';
import { DeepPartial } from '../util/types';
import { authSlice } from './auth';
import { AppStore, RootState } from './types';

export const createStore = (preloadedState: DeepPartial<RootState> = {}): AppStore => {
  return configureStore({
    reducer: {
      auth: authSlice.reducer,
    },
    preloadedState,
  });
};
