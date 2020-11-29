import { DeepPartial } from '@stringsync/common';
import { configureStore } from '@reduxjs/toolkit';
import { deviceSlice } from './device';
import { viewportSlice } from './viewport';
import { authSlice } from './auth';
import { historySlice } from './history';
import { librarySlice } from './library';
import { RootState, AppStore } from './types';
import { tagSlice } from './tag';

export const createStore = (preloadedState: DeepPartial<RootState> = {}): AppStore => {
  return configureStore({
    reducer: {
      device: deviceSlice.reducer,
      viewport: viewportSlice.reducer,
      auth: authSlice.reducer,
      history: historySlice.reducer,
      library: librarySlice.reducer,
      tag: tagSlice.reducer,
    },
    preloadedState,
  });
};
