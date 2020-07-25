import { DeepPartial } from '@stringsync/common';
import { configureStore } from '@reduxjs/toolkit';
import { deviceSlice } from './device';
import { viewportSlice } from './viewport';
import { authSlice } from './auth';
import { historySlice } from './history';
import { RootState, AppStore } from './types';

export const createStore = (preloadedState: DeepPartial<RootState> = {}): AppStore => {
  return configureStore({
    reducer: {
      device: deviceSlice.reducer,
      viewport: viewportSlice.reducer,
      auth: authSlice.reducer,
      history: historySlice.reducer,
    },
    preloadedState,
  });
};
